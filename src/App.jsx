import { useState, useEffect } from "react";
import "./App.css";
import ReactMarkdown from 'react-markdown'

const formatTime = (ts) => {
  const date = new Date(ts);
  const p = (n) => String(n).padStart(2, "0");
  return (
    `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())} ` +
    `${p(date.getHours())}:${p(date.getMinutes())}:${p(date.getSeconds())}`
  );
};

const decodeArticle = async (base64) => {
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  const stream = new Blob([bytes])
    .stream()
    .pipeThrough(new DecompressionStream("gzip"));
  return await new Response(stream).text();
};

const navItems = [
  { key: "home", label: "Home" },
  { key: "js", label: "JS" },
  { key: "node", label: "Node" },
  { key: "tool", label: "Tool" },
  { key: "awesome", label: "Awesome" },
  { key: "html", label: "HTML" },
  { key: "css", label: "CSS" },
  { key: "assemble", label: "Assemble" },
];

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [categoryData, setCategoryData] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [activeNav, setActiveNav] = useState("home");
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    fetch("/data/data.json")
      .then((res) => res.json())
      .then(setCategoryData)
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const openArticle = async (category, name, title) => {
    const res = await fetch("/data/all.json");
    const all = await res.json();
    const content = await decodeArticle(all[`${category}/${name}`]);
    setCurrent({ title, content });
  };

  const articles = categoryData
    ? Object.entries(categoryData).flatMap(([category, list]) =>
        list.map((item) => ({ ...item, category })),
      )
    : [];

  const filterData = articles.filter(
    (article) =>
      (activeNav === "home" || article.category === activeNav) &&
      article.title.toLowerCase().includes(keyword.toLowerCase()),
  );

  return (
    <>
      <header className="header">
        <div className="headerLeft">
          <span>Blog</span>
          <div className="headerSearch">
            <input
              type="text"
              placeholder="Search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
        </div>
        <div className="headerRight">
          <div className="headerSelect">English</div>
          <div className="headerSelect">Follow system</div>
        </div>
      </header>
      <div className={"main" + (collapsed ? " collapsed" : "")}>
        <div className={"mainLeft" + (collapsed ? " collapsed" : "")}>
          <ul className="navList">
            {navItems.map((item) => (
              <li
                key={item.key}
                className={
                  "navItem" + (activeNav === item.key ? " active" : "")
                }
                onClick={() => {
                  setActiveNav(item.key);
                  setCurrent(null);
                }}
              >
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mainRight">
          <button
            id="collapseBtn"
            onClick={() => setCollapsed((c) => !c)}
            title={collapsed ? "展开" : "折叠"}
          >
            {collapsed ? "▶" : "◀"}
          </button>
          <div className="content">
            {current ? (
              <>
                <h1 className="articleTitle">{current.title}</h1>
                <div className="articleBody">
                  <ReactMarkdown>{current.content}</ReactMarkdown>
                </div>
              </>
            ) : (
              <>
                <div className="totalBar">
                  Total {filterData.length} articles
                </div>
                <table className="articleTable">
                  <colgroup>
                    <col className="colTitle" />
                    <col className="colTime" />
                    <col className="colTime" />
                    <col className="colWords" />
                  </colgroup>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Update Time</th>
                      <th>Creation Time</th>
                      <th>Words</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterData.map((a) => (
                      <tr key={`${a.category}/${a.name}`}>
                        <td>
                          <a
                            className="titleLink"
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              openArticle(a.category, a.name, a.title);
                            }}
                          >
                            {a.title}
                          </a>
                        </td>
                        <td>{formatTime(a.mtime)}</td>
                        <td>{formatTime(a.ctime)}</td>
                        <td className="wordsCell">
                          {a.size.toLocaleString("en-US")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
