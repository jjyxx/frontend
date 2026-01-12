"use client"; // 告诉 Next.js 这是个交互组件

interface Product {
  name: string;
  brand: string;
  reason: string;
  caution: string;
  ingredients: string[]; // 这是一个字符串数组
}

import { useState } from "react";

export default function Home() {
  // 1. 定义状态 (State)：存储用户的选择
  const [formData, setFormData] = useState({
    skin_type: "油性",
    concern: "痘痘",
    budget: "学生党",
  });
  const [result, setResult] = useState<Product[]>([]); // 存储 AI 的回信
  const [loading, setLoading] = useState(false); // 是否正在加载
  const [error, setError] = useState("");

  // 2. 提交逻辑：给后端打电话
  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setResult([]);
    try {
      const response = await fetch("http://127.0.0.1:8000/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      let rawContent = data.recommendation;
      const cleanContent = rawContent.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsedData = JSON.parse(cleanContent) as Product[];
      setResult(parsedData);


    } catch (error) {
      setError("出错了，请检查后端是否开启！");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8 text-gray-800">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-indigo-600">✨ AI 智选护肤助手</h1>

        {/* 表单区域 */}
        <div className="space-y-6">
          <div>
            <label className="block font-medium mb-2">你的肤质</label>
            <div className="flex gap-2">
              {["油性", "干性", "敏感", "混合"].map((t) => (
                <button
                  key={t}
                  onClick={() => setFormData({ ...formData, skin_type: t })}
                  className={`px-4 py-2 rounded-full border ${formData.skin_type === t ? 'bg-indigo-600 text-white' : 'bg-white'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-medium mb-2">主要困扰</label>
            <select
              className="w-full p-2 border rounded-lg"
              onChange={(e) => setFormData({ ...formData, concern: e.target.value })}
            >
              <option value="痘痘">痘痘/闭口</option>
              <option value="暗沉">暗沉/提亮</option>
              <option value="缺水">干燥/脱皮</option>
            </select>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-4 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all"
          >
            {loading ? "AI 正在为你分析成分..." : "生成我的专属方案"}
          </button>
        </div>

        {/* 结果展示区 */}
        {result && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">✨ 为你定制的方案</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 假设 result 现在是一个数组 */}
              {result.map((item: Product, index: number) => (
                <div key={index} className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col">
                  <div className="mb-4">
                    <span className="text-xs font-bold bg-indigo-100 text-indigo-600 px-2 py-1 rounded uppercase tracking-wider">
                      {item.brand}
                    </span>
                    <h3 className="text-lg font-bold mt-2 text-gray-900">{item.name}</h3>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 flex-grow italic">
                    “{item.reason}”
                  </p>

                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {item.ingredients.map((ing) => (
                        <span key={ing} className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-100">
                          {ing}
                        </span>
                      ))}
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg">
                      <p className="text-xs text-red-700 font-medium">⚠️ 避雷：{item.caution}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-xs text-gray-400">结果符合要求吗？</span>
                    <div className="flex gap-2">
                      <button className="hover:bg-gray-100 p-1 rounded">👍</button>
                      <button className="hover:bg-gray-100 p-1 rounded">👎</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}