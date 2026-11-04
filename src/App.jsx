import { useState, useEffect } from "react";
import { useLocalStorage, useMedia } from "react-use";
import ReactMarkdown from "react-markdown";

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

const thBase =
  "whitespace-nowrap border-b border-line bg-th px-4 py-[15px] text-left font-semibold";
const tdClass =
  "overflow-hidden text-ellipsis whitespace-nowrap border-b border-line-light px-4 py-[15px] text-ink-2";

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [categoryData, setCategoryData] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [activeNav, setActiveNav] = useState("home");
  const [current, setCurrent] = useState(null);

  const [theme, setTheme] = useLocalStorage("blog-theme", "system");
  const isSystemDark = useMedia("(prefers-color-scheme: dark)");
  const isDark = theme === "system" ? isSystemDark : theme === "dark";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

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
    <div className="text-ink">
      <header className="flex h-16 items-center justify-between border-b border-line bg-panel px-5">
        <div className="flex items-center gap-4">
          <span>Blog</span>
          <div className="flex h-8 w-70 items-center rounded-md border border-line bg-subtle px-2.5">
            <input
              type="text"
              placeholder="Search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="flex-1 border-none bg-transparent text-[13px] text-ink outline-none placeholder:text-ink-2/60"
            />
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="h-8 cursor-pointer rounded-md border border-line bg-panel px-3 text-[13px] leading-8 text-ink-2 hover:bg-hover">
            English
          </div>
          <div className="relative">
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="h-8 cursor-pointer appearance-none rounded-md border border-line bg-panel py-0 pl-3 pr-7 text-[13px] text-ink-2 hover:bg-hover"
            >
              <option value="light">Light mode</option>
              <option value="dark">Dark mode</option>
              <option value="system">Follow system</option>
            </select>
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-ink-2">
              ▾
            </span>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-64px)]">
        <div
          className={`shrink-0 overflow-hidden whitespace-nowrap border-r border-line bg-panel transition-[width,padding] duration-300 ${
            collapsed ? "w-0 border-r-0 px-0 py-3" : "w-[150px] px-2 py-3"
          }`}
        >
          <ul>
            {navItems.map((item) => (
              <li
                key={item.key}
                onClick={() => {
                  setActiveNav(item.key);
                  setCurrent(null);
                }}
                className={`mb-0.5 flex h-10 cursor-pointer select-none items-center rounded-lg px-3.5 text-sm ${
                  activeNav === item.key
                    ? "bg-active-bg text-active-ink"
                    : "text-ink hover:bg-hover"
                }`}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex-1 bg-page p-3">
          <button
            onClick={() => setCollapsed((c) => !c)}
            title={collapsed ? "展开" : "折叠"}
            className={`absolute top-1/2 z-[2] h-14 w-[18px] -translate-y-1/2 cursor-pointer rounded-full border-none bg-panel text-[9px] leading-none text-ink shadow-[0_2px_8px_rgba(0,0,0,0.15)] hover:text-active-ink ${
              collapsed ? "left-1" : "-left-[9px]"
            }`}
          >
            {collapsed ? "▶" : "◀"}
          </button>

          <div className="h-full overflow-y-auto bg-panel">
            {current ? (
              <>
                <h1 className="px-6 pt-6 text-[22px] font-semibold">
                  {current.title}
                </h1>
                <div className="markdown px-6 pb-8 pt-4 text-sm leading-[1.8]">
                  <ReactMarkdown>{current.content}</ReactMarkdown>
                </div>
              </>
            ) : (
              <>
                <div className="border-b border-line px-4 py-4 text-sm">
                  Total {filterData.length} articles
                </div>
                <table className="w-full table-fixed border-collapse text-sm">
                  <thead>
                    <tr>
                      <th className={`w-[26%] ${thBase}`}>Title</th>
                      <th className={`w-[30%] ${thBase}`}>Update Time</th>
                      <th className={`w-[30%] ${thBase}`}>Creation Time</th>
                      <th className={thBase}>Words</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterData.map((a) => (
                      <tr
                        key={`${a.category}/${a.name}`}
                        className="hover:bg-subtle"
                      >
                        <td className={tdClass}>
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              openArticle(a.category, a.name, a.title);
                            }}
                            className="text-link no-underline hover:underline"
                          >
                            {a.title}
                          </a>
                        </td>
                        <td className={tdClass}>{formatTime(a.mtime)}</td>
                        <td className={tdClass}>{formatTime(a.ctime)}</td>
                        <td className={`${tdClass} tabular-nums`}>
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
    </div>
  );
};

export default App;
