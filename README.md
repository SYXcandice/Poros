# Poros · TVCG / ISMAR 2026

论文 **Poros: Perception-Enabled Interactive Assistance for Appliance Use by Blind and Low Vision Users** 的项目网页。

原生 HTML / CSS / JavaScript，无需安装前端依赖或构建。英文内容，适配桌面和手机，支持键盘导航、图片放大、BibTeX 复制以及减少动态效果的系统偏好。字体使用系统字体，无外部字体请求。

## 本地预览

在仓库目录运行：

```sh
python3 -m http.server 8080
```

打开 http://localhost:8080 。也可直接打开 `index.html`；复制功能推荐在 localhost 或 HTTPS 下使用。

## 添加论文和视频

编辑 `site-config.js`。链接留空时，页面显示 Coming soon；填写后，论文按钮和资源列表会自动启用，视频占位区域自动变成播放器。

```js
window.POROS_CONFIG = Object.freeze({
  paperUrl: "assets/papers/poros.pdf",
  videoUrl: "assets/videos/poros.mp4",
  videoPoster: "",        // 可选：视频封面图片路径
  videoCaptions: "",      // 可选：英文 WebVTT 字幕路径
});
```

- 论文：把最终要公开的 PDF 放到 `assets/papers/poros.pdf`，或填写外部 HTTPS 链接。
- 视频：支持 MP4、YouTube 和 Vimeo 链接（包括 Vimeo 非公开链接的 hash）。大视频推荐放视频平台，避免 GitHub 单文件大小限制。
- 当前没有公开论文 PDF 或视频，所提供的 camera-ready PDF 仅用于核对内容。
- 最终 DOI、卷号、页码公布后，更新 `index.html` 中的 BibTeX 和相关提示。

## GitHub Pages

仓库已提供 `.github/workflows/deploy.yml`。首次发布时，在 GitHub 仓库的 **Settings → Pages → Build and deployment → Source** 中选择 **GitHub Actions**，然后运行 **Deploy project page** 工作流（或向 `main` 推送更新）。

项目地址预计为 https://SYXcandice.github.io/Poros/ 。启用 Pages 并部署成功后该地址才可访问。

工作流只发布网站文件和 `assets`，不会把说明文档、校验脚本或 Git 元数据打包到网站。

## 内容与图片

四张 WebP 图片由作者提供的 PDF 图导出：

| 网站文件 | 来源 |
| --- | --- |
| `assets/images/teaser.webp` | `Teaser.pdf` |
| `assets/images/system.webp` | `System.pdf` |
| `assets/images/instruction-generation.webp` | `InitialInstru.pdf` |
| `assets/images/study-results.webp` | `Confi_Request_Success.pdf` |

原始图表保留研究内容；论文标题、作者、单位、摘要、结果和引文取自作者提供的 manuscript。TVCG 接收状态和 ISMAR 2026 信息由作者提供。研究结果明确限定在有效研究试次内，标注简单任务 12 人、复杂任务 10 人；不将完成时间的数值下降表述为统计显著。

## 静态校验

```sh
python3 scripts/check_site.py
```

检查本地资源、锚点、重复 ID 和图片替代文本。网页无需 npm 依赖。
