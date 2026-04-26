import React, { useState } from 'react';
import surgeryIcon from './assets/surgery.png';
import backgroundImage from './assets/background.webp';

// Thành phần nút lựa chọn
const ToggleBtn = ({ label, active, onClick, options = { yes: "Có", no: "Không" } }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
    <span className="text-sm font-bold text-gray-700 uppercase tracking-tight pr-4">{label}</span>
    <div className="flex bg-gray-200 rounded-md p-1 min-w-[120px]">
      <button
        onClick={() => onClick(1)}
        className={`flex-1 py-1 px-2 text-[10px] font-black rounded transition-all uppercase ${active === 1 ? 'bg-[#1D4ED8] text-white shadow-sm' : 'text-gray-500'}`}
      >
        {options.yes}
      </button>
      <button
        onClick={() => onClick(0)}
        className={`flex-1 py-1 px-2 text-[10px] font-black rounded transition-all uppercase ${active === 0 ? 'bg-[#64748b] text-white shadow-sm' : 'text-gray-500'}`}
      >
        {options.no}
      </button>
    </div>
  </div>
);

function App() {
  const [ageInput, setAgeInput] = useState('');
  const [data, setData] = useState({ 
    is_female: 0, asa_ge3: 0, high_anxiety: 0, 
    time_ge120: 0, regional_anes: 0, non_opioid: 0 
  });
  const [result, setResult] = useState(null);
  const [showInfo, setShowInfo] = useState(false); // Trạng thái hiển thị Modal

  const calculate = () => {
    const ageValue = parseInt(ageInput) >= 60 ? 1 : 0;
    const z = -1.6 
              + (0.65 * ageValue) + (0.72 * data.is_female) 
              + (0.88 * data.asa_ge3) + (1.25 * data.high_anxiety) 
              + (0.58 * data.time_ge120) - (1.10 * data.regional_anes) 
              - (0.85 * data.non_opioid);

    const p = 1 / (1 + Math.exp(-z));
    setResult({ 
      p: p.toFixed(2), 
      percent: Math.round(p * 100), 
      risk: p > 0.5 ? 'NGUY CƠ CAO' : 'NGUY CƠ THẤP' 
    });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 relative">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat grayscale-[20%]" style={{ backgroundImage: `url(${backgroundImage})` }} />
        <div className="absolute inset-0 bg-slate-100/45 backdrop-blur-[5px]" /> 
      </div>
      
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 px-6 py-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={surgeryIcon} alt="Logo" className="w-10 h-10" />
            <div>
              <h2 className="text-[10px] md:text-xs font-bold text-blue-600 uppercase tracking-widest leading-tight">Bệnh viện Ung Bướu • Khoa Gây mê hồi sức</h2>
              <h1 className="font-black text-gray-900 text-lg md:text-2xl tracking-tighter uppercase">Dự đoán đau sau mổ</h1>
            </div>
          </div>
          
          {/* Nút dấu chấm than thông tin */}
          <button 
            onClick={() => setShowInfo(true)}
            className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black shadow-sm hover:bg-blue-600 hover:text-white transition-all border border-blue-200"
            title="Thông tin phần mềm"
          >
            i
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto w-full p-4 md:p-10 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/40">
              <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-100">
                <p className="text-sm font-bold text-gray-500 italic">Vui lòng nhập số liệu bệnh nhân:</p>
              </div>
              <div className="p-6 space-y-1">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-sm font-bold text-gray-700 uppercase tracking-tight pr-4">Tuổi bệnh nhân</span>
                  <input type="number" placeholder="Nhập..." value={ageInput} onChange={(e) => setAgeInput(e.target.value)}
                    className="bg-gray-100 border-none rounded-md px-3 py-2 text-sm font-bold w-[100px] text-right focus:ring-2 focus:ring-blue-500" />
                </div>
                <ToggleBtn label="Giới tính" active={data.is_female} onClick={(v) => setData({...data, is_female: v})} options={{ yes: "Nữ", no: "Nam" }} />
                <ToggleBtn label="Phân loại ASA ≥ III" active={data.asa_ge3} onClick={(v) => setData({...data, asa_ge3: v})} />
                <ToggleBtn label="Lo âu cao (APAIS ≥ 11)" active={data.high_anxiety} onClick={(v) => setData({...data, high_anxiety: v})} />
                <ToggleBtn label="Thời gian mổ ≥ 120 phút" active={data.time_ge120} onClick={(v) => setData({...data, time_ge120: v})} />
                <ToggleBtn label="Có gây tê vùng" active={data.regional_anes} onClick={(v) => setData({...data, regional_anes: v})} />
                <ToggleBtn label="Non-opioid ≥ 2 loại" active={data.non_opioid} onClick={(v) => setData({...data, non_opioid: v})} />
              </div>
              <div className="p-6 bg-gray-50/80 flex gap-4 border-t border-gray-100">
                <button onClick={calculate} className="flex-1 bg-[#1D4ED8] text-white py-4 rounded-xl font-black uppercase shadow-md hover:bg-blue-700 transition-all active:scale-95">Xác nhận tính toán</button>
                <button onClick={() => {setAgeInput(''); setData({is_female:0, asa_ge3:0, high_anxiety:0, time_ge120:0, regional_anes:0, non_opioid:0}); setResult(null);}} 
                        className="px-6 py-4 border border-gray-300 text-gray-600 rounded-xl font-bold uppercase hover:bg-gray-100 transition-all">Làm mới</button>
              </div>
            </div>
          </div>

          {/* Kết quả */}
          <div className="lg:col-span-1">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden lg:sticky lg:top-32 border border-white/40">
              <div className="bg-blue-600 px-6 py-3"><h2 className="text-white font-bold uppercase text-[10px] tracking-widest text-center">Kết quả phân tích</h2></div>
              <div className="p-6 space-y-8">
                {result ? (
                  <>
                    <div className="text-center animate-in fade-in zoom-in duration-300">
                      <span className="text-xs font-black text-gray-400 uppercase">Xác suất nguy cơ (P)</span>
                      <div className="flex flex-col items-center gap-4 mt-2">
                        <span className="text-6xl font-black text-gray-800 tracking-tighter">{result.p}</span>
                        <div className="w-full h-3 bg-gray-100 rounded-full relative overflow-hidden shadow-inner">
                          <div className={`h-full transition-all duration-700 ${result.percent > 50 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${result.percent}%` }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="pt-6 border-t border-gray-100 text-center">
                      <span className="text-xs font-black text-gray-400 uppercase block mb-2">Đánh giá nguy cơ</span>
                      <div className={`flex items-center justify-center gap-2 font-black text-2xl uppercase tracking-tighter ${result.percent > 50 ? 'text-red-600' : 'text-green-600'}`}>
                        {result.percent > 50 ? '🔴' : '🟢'} {result.risk}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="py-20 text-center text-gray-300"><div className="text-6xl mb-4 grayscale opacity-20">🩺</div><p className="text-[10px] font-black uppercase tracking-[0.2em]">Nhập liệu để xem báo cáo</p></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL THÔNG TIN (TRỒI LÊN) */}
      {showInfo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto animate-in zoom-in slide-in-from-bottom-4 duration-300">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-black text-blue-800 uppercase tracking-tighter">Thông tin phần mềm</h2>
                <button onClick={() => setShowInfo(false)} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">✕</button>
              </div>
              
              <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
                <section>
                  <h3 className="font-black text-gray-900 uppercase mb-2 text-xs tracking-widest">1. Mục đích & Mục tiêu</h3>
                  <p>Ứng dụng được phát triển nhằm hỗ trợ bác sĩ Gây mê hồi sức tiên lượng sớm nguy cơ đau mức độ trung bình-nặng sau phẫu thuật. Từ đó, đưa ra chiến lược giảm đau đa mô thức cá thể hóa, giúp cải thiện chất lượng hồi phục của bệnh nhân.</p>
                </section>

                <section>
                  <h3 className="font-black text-gray-900 uppercase mb-2 text-xs tracking-widest">2. Hướng dẫn sử dụng</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Nhập chính xác tuổi của bệnh nhân (Hệ thống tự động tính ngưỡng ≥ 60).</li>
                    <li>Chọn các yếu tố nguy cơ tương ứng (Nam/Nữ, ASA, Lo âu...).</li>
                    <li>Bấm <strong>"Xác nhận tính toán"</strong> để nhận kết quả xác suất (P).</li>
                    <li>Nếu P &gt; 0.5: Bệnh nhân thuộc nhóm nguy cơ cao.</li>
                  </ul>
                </section>

                <section className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                  <h3 className="font-black text-amber-800 uppercase mb-2 text-xs tracking-widest">3. Lưu ý quan trọng</h3>
                  <p className="italic text-amber-900">Kết quả từ phần mềm chỉ mang tính chất hỗ trợ quyết định lâm sàng. Bác sĩ cần kết hợp với tình trạng thực tế của bệnh nhân và kinh nghiệm chuyên môn để đưa ra phác đồ điều trị cuối cùng.</p>
                </section>
              </div>

              <button onClick={() => setShowInfo(false)} className="w-full mt-8 bg-slate-900 text-white py-4 rounded-xl font-bold uppercase">Đã hiểu</button>
            </div>
          </div>
        </div>
      )}

      <footer className="relative z-10 py-8 px-6 text-center text-gray-500 text-[10px] uppercase font-bold tracking-[0.3em] bg-white/40 backdrop-blur-sm mt-auto">
        Bệnh viện Ung Bướu • Khoa Gây mê hồi sức • 2026
      </footer>
    </div>
  );
}

export default App;