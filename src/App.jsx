import React, { useState } from 'react';
import surgeryIcon from './assets/surgery.png';
import backgroundImage from './assets/background.webp';

// --- COMPONENT HỖ TRỢ ---
const ToggleBtn = ({ label, active, onClick, options = { yes: "Có", no: "Không" } }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
    <span className="text-[13px] font-bold text-gray-700 uppercase pr-4">{label}</span>
    <div className="flex bg-gray-200 rounded-md p-1 min-w-[120px]">
      <button onClick={() => onClick(1)} className={`flex-1 py-1.5 px-2 text-[10px] font-black rounded transition-all uppercase ${active === 1 ? 'bg-[#1D4ED8] text-white shadow-sm' : 'text-gray-500'}`}>{options.yes}</button>
      <button onClick={() => onClick(0)} className={`flex-1 py-1.5 px-2 text-[10px] font-black rounded transition-all uppercase ${active === 0 ? 'bg-[#64748b] text-white shadow-sm' : 'text-gray-500'}`}>{options.no}</button>
    </div>
  </div>
);

const Gauge = ({ value }) => {
  const rotation = (value * 180) - 90;
  return (
    <div className="relative w-48 h-24 mx-auto overflow-hidden">
      <div className="absolute top-0 left-0 w-48 h-48 rounded-full border-[18px] border-gray-100" />
      <div className="absolute top-0 left-0 w-48 h-48 rounded-full border-[18px] border-transparent border-t-green-500 border-r-yellow-500 border-l-red-500 rotate-45 opacity-30" />
      <div className="absolute bottom-0 left-1/2 w-1 h-20 bg-slate-800 origin-bottom -translate-x-1/2 transition-transform duration-1000" style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }} />
      <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-slate-800 rounded-full -translate-x-1/2 translate-y-1/2 border-4 border-white" />
    </div>
  );
};

function App() {
  const [birthYear, setBirthYear] = useState(new Date().getFullYear() - 30);
  const [data, setData] = useState({ is_female: 0, asa_ge3: 0, high_anxiety: 0, time_ge120: 0, regional_anes: 0, non_opioid: 0 });
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [showInfo, setShowInfo] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);

  const calculate = () => {
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;
    const ageValue = age >= 60 ? 1 : 0;
    const z = -1.6 + (0.65 * ageValue) + (0.72 * data.is_female) + (0.88 * data.asa_ge3) + (1.25 * data.high_anxiety) + (0.58 * data.time_ge120) - (1.10 * data.regional_anes) - (0.85 * data.non_opioid);
    const p = 1 / (1 + Math.exp(-z));
    
    const newResult = { 
      id: Date.now(),
      p: p.toFixed(2), 
      percent: Math.round(p * 100), 
      risk: p > 0.5 ? 'NGUY CƠ CAO' : 'NGUY CƠ THẤP',
      time: new Date().toLocaleString('vi-VN'),
      settings: { ...data, birthYear, age }
    };
    
    setResult(newResult);
    setHistory([newResult, ...history.slice(0, 9)]);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 relative bg-slate-50">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat grayscale-[20%]" style={{ backgroundImage: `url(${backgroundImage})` }} />
        <div className="absolute inset-0 bg-slate-100/40 backdrop-blur-[6px]" /> 
      </div>
      
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 px-6 py-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <img src={surgeryIcon} alt="Logo" className="w-10 h-10" />
          <div>
            <h2 className="text-[10px] font-bold text-blue-600 uppercase tracking-widest leading-tight">Bệnh viện Ung Bướu • Khoa Gây mê hồi sức</h2>
            <h1 className="font-black text-gray-900 text-lg md:text-xl uppercase tracking-tighter">Dự đoán đau sau mổ</h1>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto w-full p-4 md:p-8 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* CỘT TRÁI: NHẬP LIỆU */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 relative">
              <div className="flex justify-between items-center mb-4">
                <p className="text-[11px] font-black text-gray-400 uppercase italic tracking-widest">Thông tin & Chỉ số lâm sàng</p>
                <button onClick={() => setShowInfo(true)} className="w-6 h-6 rounded-full bg-slate-200 hover:bg-blue-600 hover:text-white text-slate-500 text-[10px] font-black transition-all flex items-center justify-center">i</button>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-sm font-bold text-gray-700 uppercase">Năm sinh bệnh nhân</span>
                  <input 
                    type="number" 
                    min="1900" 
                    max={new Date().getFullYear()} 
                    value={birthYear} 
                    onChange={(e) => setBirthYear(parseInt(e.target.value))} 
                    className="bg-gray-100 rounded-lg px-3 py-2 text-sm font-bold w-[120px] text-right focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                </div>
                <ToggleBtn label="Giới tính" active={data.is_female} onClick={(v) => setData({...data, is_female: v})} options={{ yes: "Nữ", no: "Nam" }} />
                <ToggleBtn label="ASA Classification ≥ III" active={data.asa_ge3} onClick={(v) => setData({...data, asa_ge3: v})} />
                <ToggleBtn label="Lo âu cao (APAIS ≥ 11)" active={data.high_anxiety} onClick={(v) => setData({...data, high_anxiety: v})} />
                <ToggleBtn label="Thời gian mổ ≥ 120 phút" active={data.time_ge120} onClick={(v) => setData({...data, time_ge120: v})} />
                <ToggleBtn label="Gây tê vùng kết hợp" active={data.regional_anes} onClick={(v) => setData({...data, regional_anes: v})} />
                <ToggleBtn label="Non-opioid trong mổ ≥ 2 loại" active={data.non_opioid} onClick={(v) => setData({...data, non_opioid: v})} />
              </div>
              <div className="pt-6 flex gap-4">
                <button onClick={calculate} className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-black uppercase shadow-lg hover:bg-blue-700 active:scale-95 transition-all tracking-widest">Phân tích kết quả</button>
                <button onClick={() => {setBirthYear(new Date().getFullYear() - 30); setResult(null);}} className="px-6 border border-gray-300 rounded-xl font-bold uppercase text-gray-500 hover:bg-gray-50 transition-colors">Làm mới</button>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: KẾT QUẢ & LỊCH SỬ */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl border border-blue-50 overflow-hidden">
              <div className="bg-slate-800 px-6 py-3 flex justify-between items-center">
                <h2 className="text-white font-bold uppercase text-[10px] tracking-widest">Xác suất tiên lượng (P)</h2>
              </div>
              <div className="p-8 text-center">
                {result ? (
                  <div className="animate-in fade-in zoom-in duration-500">
                    <Gauge value={result.p} />
                    <div className="mt-6">
                      <div className="text-7xl font-black text-slate-800 tracking-tighter my-2 leading-none">{result.p}</div>
                      <div className={`mt-4 py-2 px-8 inline-block rounded-full font-black text-xs uppercase tracking-widest shadow-md ${result.percent > 50 ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
                        {result.risk}
                      </div>
                      
                      {/* Dòng lưu ý chỉ dành cho nguy cơ cao theo yêu cầu chị Thư Nấm */}
                      {result.percent > 50 && (
                        <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl text-red-700 animate-bounce">
                           <p className="text-[11px] font-black uppercase mb-1">⚠️ Lưu ý lâm sàng:</p>
                           <p className="text-sm font-bold">Theo dõi NRS sát - Báo BS can thiệp giảm đau sớm</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="py-24 opacity-20 flex flex-col items-center">
                    <div className="text-7xl mb-4">🩺</div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">Sẵn sàng phân tích dữ liệu</p>
                  </div>
                )}
              </div>
            </div>

            {/* LỊCH SỬ GẦN ĐÂY */}
            {history.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-md">
                <h3 className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest text-center">Các ca đã đánh giá</h3>
                <div className="space-y-2">
                  {history.map((item, idx) => (
                    <button key={item.id} onClick={() => setSelectedHistoryItem(item)} className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-white rounded-xl border border-transparent hover:border-blue-200 transition-all shadow-sm">
                      <div className="text-left leading-tight">
                        <p className="text-[9px] font-bold text-gray-400">{item.time}</p>
                        <p className="text-sm font-black text-slate-800">Năm sinh: {item.settings.birthYear}</p>
                      </div>
                      <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${item.percent > 50 ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>P: {item.p}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* MODAL CHI TIẾT */}
      {selectedHistoryItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in">
            <h2 className="text-xl font-black text-slate-800 uppercase mb-6 border-b pb-4">Chi tiết chỉ số</h2>
            <div className="space-y-2.5 mb-8 text-sm">
              <div className="flex justify-between border-b border-gray-50 pb-1"><span className="text-gray-400 font-bold uppercase text-[10px]">Tuổi tính toán:</span><span className="font-black">{selectedHistoryItem.settings.age} tuổi</span></div>
              <div className="flex justify-between border-b border-gray-50 pb-1"><span className="text-gray-400 font-bold uppercase text-[10px]">Giới tính:</span><span className="font-black">{selectedHistoryItem.settings.is_female ? 'Nữ' : 'Nam'}</span></div>
              <div className="flex justify-between border-b border-gray-50 pb-1"><span className="text-gray-400 font-bold uppercase text-[10px]">ASA ≥ III:</span><span className="font-black">{selectedHistoryItem.settings.asa_ge3 ? 'Có' : 'Không'}</span></div>
              <div className="flex justify-between border-b border-gray-50 pb-1"><span className="text-gray-400 font-bold uppercase text-[10px]">Lo âu:</span><span className="font-black">{selectedHistoryItem.settings.high_anxiety ? 'Có' : 'Không'}</span></div>
              <div className="flex justify-between border-b border-gray-50 pb-1"><span className="text-gray-400 font-bold uppercase text-[10px]">Mổ ≥ 120p:</span><span className="font-black">{selectedHistoryItem.settings.time_ge120 ? 'Có' : 'Không'}</span></div>
              <div className="flex justify-between border-b border-gray-50 pb-1"><span className="text-gray-400 font-bold uppercase text-[10px]">Gây tê vùng kết hợp:</span><span className="font-black">{selectedHistoryItem.settings.regional_anes ? 'Có' : 'Không'}</span></div>
              <div className="flex justify-between border-b border-gray-50 pb-1"><span className="text-gray-400 font-bold uppercase text-[10px]">Non-opioid trong mổ:</span><span className="font-black">{selectedHistoryItem.settings.non_opioid ? 'Có' : 'Không'}</span></div>
            </div>
            <button onClick={() => setSelectedHistoryItem(null)} className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest">Đóng lại</button>
          </div>
        </div>
      )}

      {/* MODAL THÔNG TIN */}
      {showInfo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto animate-in zoom-in">
            <div className="flex justify-between items-center mb-8 border-b pb-4">
              <h2 className="text-2xl font-black text-blue-700 uppercase tracking-tighter">Thông tin ứng dụng</h2>
              <button onClick={() => setShowInfo(false)} className="text-3xl font-bold text-gray-300 hover:text-gray-900 transition-colors">✕</button>
            </div>
            <div className="space-y-6 text-sm text-gray-600 font-medium text-justify">
              <section>
                <h3 className="text-blue-600 font-black uppercase text-xs tracking-widest mb-2">1. Phạm vi áp dụng</h3>
                <p>Mô hình tiên lượng xác suất đau trung bình-nặng trong 24h đầu sau mổ dựa trên nghiên cứu lâm sàng tại BV Ung Bướu TP.HCM.</p>
              </section>
              <section>
                <h3 className="text-red-600 font-black uppercase text-xs tracking-widest mb-2">2. Cảnh báo quan trọng</h3>
                <div className="bg-red-50 p-4 rounded-xl border border-red-100 italic font-bold text-red-800">
                  Phần mềm chỉ hỗ trợ đánh giá nguy cơ. Mọi chỉ định lâm sàng cuối cùng phải do Bác sĩ Gây mê thực hiện dựa trên tình trạng thực tế của bệnh nhân.
                </div>
              </section>
            </div>
            <button onClick={() => setShowInfo(false)} className="w-full mt-10 bg-blue-600 text-white py-4 rounded-xl font-black uppercase shadow-md">Đã hiểu</button>
          </div>
        </div>
      )}

      <footer className="relative z-10 py-5 text-center bg-slate-900 border-t border-slate-800 mt-auto">
        <p className="text-white font-black text-[11px] uppercase tracking-[0.4em]">
          BV Ung Bướu <span className="text-blue-500 mx-2">•</span> Khoa Gây mê hồi sức <span className="text-blue-500 mx-2">•</span> 2026
        </p>
      </footer>
    </div>
  );
}

export default App;