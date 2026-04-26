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
  const [patientName, setPatientName] = useState('');
  const [birthDate, setBirthDate] = useState('1990-01-01');
  const [data, setData] = useState({ is_female: 0, asa_ge3: 0, high_anxiety: 0, time_ge120: 0, regional_anes: 0, non_opioid: 0 });
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [showInfo, setShowInfo] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDateObj = new Date(dob);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const m = today.getMonth() - birthDateObj.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) age--;
    return age;
  };

  const calculate = () => {
    const age = calculateAge(birthDate);
    const ageValue = age >= 60 ? 1 : 0;
    const z = -1.6 + (0.65 * ageValue) + (0.72 * data.is_female) + (0.88 * data.asa_ge3) + (1.25 * data.high_anxiety) + (0.58 * data.time_ge120) - (1.10 * data.regional_anes) - (0.85 * data.non_opioid);
    const p = 1 / (1 + Math.exp(-z));
    
    const newResult = { 
      name: patientName || "Bệnh nhân vô danh",
      p: p.toFixed(2), 
      percent: Math.round(p * 100), 
      risk: p > 0.5 ? 'NGUY CƠ CAO' : 'NGUY CƠ THẤP',
      time: new Date().toLocaleString('vi-VN'),
      settings: { ...data, birthDate, age }
    };
    
    setResult(newResult);
    setHistory([newResult, ...history.slice(0, 9)]);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 relative bg-slate-50">
      {/* Background Section */}
      <div className="fixed inset-0 z-0 no-print">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat grayscale-[20%]" style={{ backgroundImage: `url(${backgroundImage})` }} />
        <div className="absolute inset-0 bg-slate-100/40 backdrop-blur-[6px]" /> 
      </div>
      
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 px-6 py-4 sticky top-0 z-50 shadow-sm no-print">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <img src={surgeryIcon} alt="Logo" className="w-10 h-10" />
          <div>
            <h2 className="text-[10px] font-bold text-blue-600 uppercase tracking-widest leading-tight">Bệnh viện Ung Bướu • Khoa Gây mê hồi sức</h2>
            <h1 className="font-black text-gray-900 text-lg md:text-xl uppercase tracking-tighter">Dự đoán đau sau mổ</h1>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto w-full p-4 md:p-8 flex-grow no-print">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* CỘT TRÁI: NHẬP LIỆU */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 relative">
              <div className="flex justify-between items-center mb-4">
                <p className="text-[11px] font-black text-gray-400 uppercase italic tracking-widest">Thông tin & Chỉ số lâm sàng</p>
                {/* NÚT i THU NHỎ ĐƯA XUỐNG ĐÂY */}
                <button 
                  onClick={() => setShowInfo(true)} 
                  className="w-6 h-6 rounded-full bg-slate-200 hover:bg-blue-600 hover:text-white text-slate-500 text-[10px] font-black transition-all flex items-center justify-center"
                >
                  i
                </button>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-sm font-bold text-gray-700 uppercase">Họ và Tên</span>
                  <input type="text" value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="Nhập tên..." className="bg-gray-100 rounded-lg px-3 py-2 text-sm font-bold w-[200px] text-right focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-sm font-bold text-gray-700 uppercase">Ngày sinh</span>
                  <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="bg-gray-100 rounded-lg px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <ToggleBtn label="Giới tính" active={data.is_female} onClick={(v) => setData({...data, is_female: v})} options={{ yes: "Nữ", no: "Nam" }} />
                <ToggleBtn label="ASA Classification ≥ III" active={data.asa_ge3} onClick={(v) => setData({...data, asa_ge3: v})} />
                <ToggleBtn label="Lo âu cao (APAIS ≥ 11)" active={data.high_anxiety} onClick={(v) => setData({...data, high_anxiety: v})} />
                <ToggleBtn label="Thời gian mổ ≥ 120 phút" active={data.time_ge120} onClick={(v) => setData({...data, time_ge120: v})} />
                <ToggleBtn label="Sử dụng gây tê vùng" active={data.regional_anes} onClick={(v) => setData({...data, regional_anes: v})} />
                <ToggleBtn label="Non-opioid ≥ 2 loại" active={data.non_opioid} onClick={(v) => setData({...data, non_opioid: v})} />
              </div>
              <div className="pt-6 flex gap-4">
                <button onClick={calculate} className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-black uppercase shadow-lg hover:bg-blue-700 active:scale-95 transition-all">Tính toán kết quả</button>
                <button onClick={() => {setPatientName(''); setBirthDate('1990-01-01'); setResult(null);}} className="px-6 border border-gray-300 rounded-xl font-bold uppercase text-gray-500 hover:bg-gray-50 transition-colors">Làm mới</button>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: KẾT QUẢ & LỊCH SỬ */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl border border-blue-50 overflow-hidden">
              <div className="bg-slate-800 px-6 py-3 flex justify-between items-center">
                <h2 className="text-white font-bold uppercase text-[10px] tracking-widest">Phân tích xác suất</h2>
                {result && <button onClick={() => window.print()} className="bg-blue-600 text-white px-3 py-1 rounded-md text-[10px] font-black uppercase hover:bg-blue-500">Lưu PDF</button>}
              </div>
              <div className="p-8 text-center">
                {result ? (
                  <div className="animate-in fade-in zoom-in duration-500">
                    <Gauge value={result.p} />
                    <div className="mt-6">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bệnh nhân: {result.name}</span>
                      <div className="text-7xl font-black text-slate-800 tracking-tighter my-2 leading-none">{result.p}</div>
                      <div className={`mt-4 py-2 px-8 inline-block rounded-full font-black text-xs uppercase tracking-widest shadow-md ${result.percent > 50 ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
                        {result.risk}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-24 opacity-20 flex flex-col items-center">
                    <div className="text-7xl mb-4">🩺</div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">Đang chờ dữ liệu đầu vào</p>
                  </div>
                )}
              </div>
            </div>

            {/* LỊCH SỬ CA GẦN ĐÂY */}
            {history.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-md">
                <h3 className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest text-center">Ca đánh giá gần đây</h3>
                <div className="space-y-2">
                  {history.map((item, idx) => (
                    <button key={idx} onClick={() => setSelectedHistoryItem(item)} className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-white rounded-xl border border-transparent hover:border-blue-200 transition-all shadow-sm">
                      <div className="text-left leading-tight">
                        <p className="text-[9px] font-bold text-gray-400">{item.time}</p>
                        <p className="text-sm font-black text-slate-800 truncate">{item.name}</p>
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

      {/* MODAL CHI TIẾT CA CŨ */}
      {selectedHistoryItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in">
            <h2 className="text-xl font-black text-slate-800 uppercase mb-6 border-b pb-4">Chi tiết: {selectedHistoryItem.name}</h2>
            <div className="space-y-2.5 mb-8 text-sm">
              <div className="flex justify-between border-b border-gray-50 pb-1"><span className="text-gray-400 font-bold uppercase text-[10px]">Ngày sinh:</span><span className="font-black">{selectedHistoryItem.settings.birthDate}</span></div>
              <div className="flex justify-between border-b border-gray-50 pb-1"><span className="text-gray-400 font-bold uppercase text-[10px]">Tuổi:</span><span className="font-black">{selectedHistoryItem.settings.age} tuổi</span></div>
              <div className="flex justify-between border-b border-gray-50 pb-1"><span className="text-gray-400 font-bold uppercase text-[10px]">Giới tính:</span><span className="font-black">{selectedHistoryItem.settings.is_female ? 'Nữ' : 'Nam'}</span></div>
              <div className="flex justify-between border-b border-gray-50 pb-1"><span className="text-gray-400 font-bold uppercase text-[10px]">ASA ≥ III:</span><span className="font-black">{selectedHistoryItem.settings.asa_ge3 ? 'Có' : 'Không'}</span></div>
              <div className="flex justify-between border-b border-gray-50 pb-1"><span className="text-gray-400 font-bold uppercase text-[10px]">Lo âu:</span><span className="font-black">{selectedHistoryItem.settings.high_anxiety ? 'Có' : 'Không'}</span></div>
              <div className="flex justify-between border-b border-gray-50 pb-1"><span className="text-gray-400 font-bold uppercase text-[10px]">Mổ ≥ 120p:</span><span className="font-black">{selectedHistoryItem.settings.time_ge120 ? 'Có' : 'Không'}</span></div>
              <div className="flex justify-between border-b border-gray-50 pb-1"><span className="text-gray-400 font-bold uppercase text-[10px]">Gây tê vùng:</span><span className="font-black">{selectedHistoryItem.settings.regional_anes ? 'Có' : 'Không'}</span></div>
              <div className="flex justify-between border-b border-gray-50 pb-1"><span className="text-gray-400 font-bold uppercase text-[10px]">Non-opioid ≥ 2:</span><span className="font-black">{selectedHistoryItem.settings.non_opioid ? 'Có' : 'Không'}</span></div>
            </div>
            <button onClick={() => setSelectedHistoryItem(null)} className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest">Đóng lại</button>
          </div>
        </div>
      )}

      {/* MODAL THÔNG TIN PHẦN MỀM */}
      {showInfo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto animate-in zoom-in">
            <div className="flex justify-between items-center mb-8 border-b pb-4">
              <h2 className="text-2xl font-black text-blue-700 uppercase tracking-tighter">Thông tin phần mềm</h2>
              <button onClick={() => setShowInfo(false)} className="text-3xl font-bold text-gray-300 hover:text-gray-900 transition-colors">✕</button>
            </div>
            <div className="space-y-8 text-sm text-gray-600 font-medium text-justify">
              <section>
                <h3 className="text-blue-600 font-black uppercase text-xs tracking-widest mb-3">1. Thông tin chung</h3>
                <p>Mô hình dựa trên hồi quy Logistic để tiên lượng xác suất đau trung bình-nặng trong 24h đầu sau mổ tại Bệnh viện Ung Bướu.</p>
              </section>
              <section>
                <h3 className="text-blue-600 font-black uppercase text-xs tracking-widest mb-3">2. Mục tiêu</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Cá thể hóa phác đồ giảm đau.</li>
                  <li>Nhận diện nguy cơ cao để can thiệp chủ động.</li>
                </ul>
              </section>
              <section>
                <h3 className="text-blue-600 font-black uppercase text-xs tracking-widest mb-3">3. Hướng dẫn sử dụng</h3>
                <p>Nhập họ tên, chọn ngày sinh và các chỉ số lâm sàng, nhấn "Tính toán" để nhận kết quả xác suất P.</p>
              </section>
              <section>
                <h3 className="text-red-600 font-black uppercase text-xs tracking-widest mb-3">4. Lưu ý</h3>
                <div className="bg-red-50 p-4 rounded-xl border border-red-100 italic font-bold text-red-800">
                  Kết quả dự đoán chỉ mang tính chất tham khảo. Quyết định điều trị thuộc về Bác sĩ Gây mê.
                </div>
              </section>
            </div>
            <button onClick={() => setShowInfo(false)} className="w-full mt-10 bg-blue-600 text-white py-4 rounded-xl font-black uppercase shadow-md">Đã hiểu</button>
          </div>
        </div>
      )}

      {/* --- PHẦN BÁO CÁO KHI IN --- */}
      <div className="hidden print-report p-12 bg-white">
        <div className="border-b-4 border-blue-700 pb-4 flex justify-between items-end">
          <div><p className="font-bold text-blue-700 uppercase">BV Ung Bướu TP.HCM</p><p className="text-xs uppercase text-gray-400">Khoa Gây mê hồi sức</p></div>
          <p className="text-xs font-black italic">{result?.time}</p>
        </div>
        <h1 className="text-center text-[24pt] font-black uppercase my-12 tracking-tight">Báo cáo tiên lượng đau sau mổ</h1>
        <div className="p-8 bg-gray-50 border border-gray-200 rounded-3xl mb-12">
          <table className="w-full text-lg">
            <tbody>
              <tr><td className="py-2 font-bold uppercase text-xs text-gray-400">Bệnh nhân:</td><td className="py-2 font-black">{result?.name}</td></tr>
              <tr><td className="py-2 font-bold uppercase text-xs text-gray-400">Xác suất (P):</td><td className="py-2 font-black text-2xl text-blue-700">{result?.p}</td></tr>
              <tr><td className="py-2 font-bold uppercase text-xs text-gray-400">Kết luận:</td><td className="py-2 font-black uppercase">{result?.risk}</td></tr>
            </tbody>
          </table>
        </div>
        <div className="mt-32 flex justify-around text-center text-xs font-black uppercase">
          <div className="w-1/3 border-t border-gray-200 pt-4">Người thực hiện</div>
          <div className="w-1/3 border-t border-gray-200 pt-4 text-blue-700">Bác sĩ Gây mê</div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-auto no-print">
        BV Ung Bướu • Khoa Gây mê hồi sức • 2026
      </footer>

      <style>{`
        @media print {
          @page { size: A4; margin: 0; }
          .no-print { display: none !important; }
          .print-report { display: block !important; }
        }
      `}</style>
    </div>
  );
}

export default App;