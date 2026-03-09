import React, { useState, useEffect } from "react";

const KeyGenerator = () => {
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem("keyGenConfig");
    return saved ? JSON.parse(saved) : { count: 7, length: 10 };
  });

  const [keys, setKeys] = useState([]);

  // Сохраняем настройки в память браузера
  useEffect(() => {
    localStorage.setItem("keyGenConfig", JSON.stringify(config));
  }, [config]);

  const generateKeys = () => {
    // Валидация
    if (config.count > 10000) return alert("Максимум 10,000 ключей за раз!");
    if (config.length > 128) return alert("Слишком длинный ключ (макс 128)!");

    const newKeys = Array.from({ length: config.count }, () => {
      let key = "";
      for (let j = 0; j < config.length; j++) {
        key += Math.floor(Math.random() * 16)
          .toString(16)
          .toUpperCase();
      }
      return key;
    });
    setKeys(newKeys);
  };

  const downloadTxt = () => {
    if (keys.length === 0) return;
    const element = document.createElement("a");
    const file = new Blob([keys.join("\n")], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `keys_${new Date().getTime()}.txt`;
    document.body.appendChild(element);
    element.click();
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Professional HEX Generator</h2>

      <div style={styles.inputGroup}>
        <div>
          <label style={styles.label}>Количество (max 10k)</label>
          <input
            type="number"
            value={config.count}
            onChange={(e) =>
              setConfig({
                ...config,
                count: Math.max(0, parseInt(e.target.value) || 0),
              })
            }
            style={styles.input}
          />
        </div>
        <div>
          <label style={styles.label}>Длина ключа</label>
          <input
            type="number"
            value={config.length}
            onChange={(e) =>
              setConfig({
                ...config,
                length: Math.max(parseInt(e.target.value)),
              })
            }
            style={styles.input}
          />
        </div>
      </div>

      <div style={styles.btnGrid}>
        <button onClick={generateKeys} style={styles.button}>
          Генерировать
        </button>
        <button
          onClick={downloadTxt}
          disabled={keys.length === 0}
          style={{ ...styles.button, ...styles.btnSecondary }}
        >
          Скачать .TXT
        </button>
      </div>

      <div style={styles.list}>
        {keys.slice(0, 100).map((key, index) => (
          <div
            key={index}
            style={styles.keyRow}
            onClick={() => copyToClipboard(key)}
            title="Нажми чтобы копировать"
          >
            <span style={styles.keyText}>{key}</span>
            <span style={styles.copyIcon}>📋</span>
          </div>
        ))}
        {keys.length > 100 && (
          <p style={styles.hint}>
            ...и еще {keys.length - 100} ключей в списке (все будут в файле)
          </p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "30px",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    maxWidth: "450px",
    margin: "40px auto",
    backgroundColor: "#fff",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  },
  title: { textAlign: "center", marginBottom: "25px", color: "#1a1a1a" },
  inputGroup: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
    marginBottom: "20px",
  },
  label: {
    fontSize: "12px",
    color: "#666",
    fontWeight: "bold",
    display: "block",
    marginBottom: "5px",
  },
  input: {
    width: "100%",
    padding: "10px",
    boxSizing: "border-box",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "16px",
  },
  btnGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" },
  button: {
    padding: "12px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "0.2s",
  },
  btnSecondary: {
    backgroundColor: "#28a745",
    opacity: (props) => (props.disabled ? 0.5 : 1),
  },
  list: {
    marginTop: "20px",
    maxHeight: "400px",
    overflowY: "auto",
    paddingRight: "5px",
  },
  keyRow: {
    padding: "12px",
    backgroundColor: "#f8f9fa",
    marginBottom: "6px",
    borderRadius: "6px",
    cursor: "pointer",
    border: "1px solid #eee",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    transition: "background 0.2s",
  },
  keyText: { fontFamily: '"Roboto Mono", monospace', color: "#333" },
  copyIcon: { fontSize: "14px", opacity: 0.5 },
  hint: { fontSize: "12px", color: "#999", textAlign: "center" },
};

export default KeyGenerator;
