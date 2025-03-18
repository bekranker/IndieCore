import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import "./CustomCSS.css"; // CSS dosyasını içe aktarın

const XlsxVisualizer = () => {
  const [data, setData] = useState([]);
  const [shake, setShake] = useState(false); // Shake animasyonu için state
  const [fileUploaded, setFileUploaded] = useState(false); // Dosya yüklendi mi kontrolü
  const [error, setError] = useState(""); // Hata mesajı
  const [showTable, setShowTable] = useState(false); // Tabloyu göster/gizle durumu
  const [file, setFile] = useState(null); // Yüklenen dosya bilgisi
  const [statusMap, setStatusMap] = useState({}); // email: {emailStatus: 'success'|'error', phoneStatus: 'success'|'error'}

  useEffect(() => {
    // Sayfa yüklendikten sonra shake animasyonunu tetiklemek
    const timer = setTimeout(() => {
      setShake(true);
      // 1 saniye sonra shake animasyonunu sıfırlamak
      setTimeout(() => setShake(false), 1000);
    }, 1000); // 1 saniye sonra shake başlayacak

    return () => clearTimeout(timer); // Component unmount olduğunda timeout'u temizle
  }, []);

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const binaryStr = e.target.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });
        setData(jsonData);
        setFileUploaded(true); // Dosya yüklendi
        setShowTable(true); // Dosya yüklendiyse tabloyu göster
        setFile(selectedFile); // Yüklenen dosyayı kaydet
      };
      reader.readAsBinaryString(selectedFile);
    }
  };

  const handleSendToDatabase = async () => {
    if (!fileUploaded) {
      setError("xlsx dosyasını ekleyin");
      setTimeout(() => setError(""), 3000); // Hata mesajını 3 saniye sonra temizle
      return;
    }

    const API_KEY = import.meta.env.VITE_BREVO_API_KEY;
    if (!API_KEY) {
      console.error("API_KEY not found. Check your .env file.");
      return;
    }

    const contacts = [];

    data.forEach((row) => {
      const email =
        row["Email"] ||
        row["E-mail"] ||
        row["Eposta"] ||
        row["E-posta"] ||
        row["Mail"] ||
        row["email"] ||
        "";

      const name =
        row["Name"] ||
        row["Full Name"] ||
        row["Adınız ve Soyadınız"] ||
        row["Adı"] ||
        row["Soyadı"] ||
        row["Ad Soyad"] ||
        ""; // İsim sütununu alıyoruz

      let phone =
        row["Telefon"] ||
        row["Phone"] ||
        row["Telefon Numaranız"] ||
        row["Phone Number"] ||
        row["phone"] ||
        "";

      // Telefon numarasını temizleme
      phone = phone.toString().replace(/[\s\-\(\)]/g, "");
      phone = "+9" + phone.slice(1);

      const phoneRegex = /^\+90\d{10}$/; // Türkiye telefon numarası formatı
      if (!phoneRegex.test(phone)) {
        console.error(`❌ Geçersiz telefon numarası: ${phone}`);
      }

      // E-mail ve telefon doğrulama statülerini kontrol et
      const emailStatus = email ? "success" : "error";
      const phoneStatus = phoneRegex.test(phone) ? "success" : "error";

      if (email) {
        contacts.push({
          email,
          attributes: {
            SMS: phone,
            Name: name, // İsim bilgisini ekliyoruz
          },
        });
      }

      setStatusMap((prevStatusMap) => ({
        ...prevStatusMap,
        [email]: { emailStatus, phoneStatus },
      }));
    });

    for (const contact of contacts) {
      try {
        await axios.post(
          "https://api.brevo.com/v3/contacts",
          {
            email: contact.email,
            attributes: contact.attributes,
            listIds: [6], // Kendi list ID'niz
            updateEnabled: true,
          },
          {
            headers: {
              "api-key": API_KEY,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );
        console.log(`✅ ${contact.email} başarıyla eklendi`);
      } catch (error) {
        console.error(
          `❌ ${contact.email} eklenirken hata oluştu:`,
          error.response?.data || error.message
        );
      }
    }
  };

  // Tabloyu gizleme fonksiyonu ve dosyayı sıfırlama
  const handleCloseTable = () => {
    setShowTable(false); // Tabloyu gizle
    setFileUploaded(false); // Dosya yüklemeyi sıfırla
    setData([]); // Veriyi temizle
    setFile(null); // Dosyayı sıfırla
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      {/* Dosya yükleme alanı ve çarpı butonu */}
      <div className="relative">
        {fileUploaded && (
          <button className="close-btn" onClick={handleCloseTable}>
            ×
          </button>
        )}
        <input
          type="file"
          accept=".xlsx"
          onChange={handleFileUpload}
          className={`p-2 border rounded ${shake ? "shake" : ""}`}
        />
      </div>

      {/* Veritabanına gönderme butonu */}
      <button
        onClick={handleSendToDatabase}
        className={`bg-blue-500 text-white px-4 py-2 rounded ${
          shake ? "shake" : ""
        } ${!fileUploaded ? "bg-red-500" : ""}`}
      >
        Send To Database
      </button>

      {/* Hata mesajı */}
      {error && <p className="error-message">{error}</p>}

      {showTable && data.length > 0 && (
        <div className="table-container">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                {Object.keys(data[0]).map((key) => {
                  const isEmailColumn = [
                    "Email",
                    "E-mail",
                    "Eposta",
                    "E-posta",
                    "Mail",
                    "email",
                  ].includes(key);
                  const isPhoneColumn = [
                    "Telefon",
                    "Phone",
                    "Telefon Numaranız",
                    "Phone Number",
                    "phone",
                  ].includes(key);

                  let columnClass = "non-valid-column";
                  if (isEmailColumn) columnClass = "email-column";
                  else if (isPhoneColumn) columnClass = "phone-column";

                  return (
                    <th key={key} className={`table-header ${columnClass}`}>
                      {key}
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              {data.map((row, rowIndex) => {
                const email =
                  row["Email"] ||
                  row["E-mail"] ||
                  row["Eposta"] ||
                  row["E-posta"] ||
                  row["Mail"] ||
                  row["email"] ||
                  "";
                const status = statusMap[email] || {};

                return (
                  <tr key={rowIndex}>
                    {Object.keys(data[0]).map((key, colIndex) => {
                      const cellValue = row[key];
                      let cellClass = "";

                      const isEmailColumn = [
                        "Email",
                        "E-mail",
                        "Eposta",
                        "E-posta",
                        "Mail",
                        "email",
                      ].includes(key);
                      const isPhoneColumn = [
                        "Telefon",
                        "Phone",
                        "Telefon Numaranız",
                        "Phone Number",
                        "phone",
                      ].includes(key);

                      if (isEmailColumn && status.emailStatus) {
                        cellClass =
                          status.emailStatus === "success"
                            ? "email-success"
                            : "email-error";
                      } else if (isPhoneColumn && status.phoneStatus) {
                        cellClass =
                          status.phoneStatus === "success"
                            ? "phone-success"
                            : "phone-error";
                      }

                      return (
                        <td key={colIndex} className={`px-3 py-2 ${cellClass}`}>
                          {cellValue}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default XlsxVisualizer;
