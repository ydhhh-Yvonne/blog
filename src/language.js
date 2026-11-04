export const messages = {
  en: {
    search: "Search",
    total: n => `Total ${n} articles`,
    title: "Title",
    category: "Category",
    updateTime: "Update Time",
    createTime: "Creation Time",
    words: "Words",
    collapse: "Collapse",
    expand: "Expand",
    theme: {
      light: "Light mode",
      dark: "Dark mode",
      system: "Follow system",
    },
  },
  zh: {
    search: "搜索",
    total: n => `共 ${n} 篇文章`,
    title: "标题",
    category: "分类",
    updateTime: "更新时间",
    createTime: "创建时间",
    words: "字数",
    collapse: "折叠",
    expand: "展开",
    theme: {
      light: "浅色模式",
      dark: "深色模式",
      system: "跟随系统",
    },
  },
};

export const getMessages = (lang) => messages[lang] ?? messages.en;
