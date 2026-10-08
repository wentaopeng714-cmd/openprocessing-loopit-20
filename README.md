# 触景 · Touching the Quiet

v2 以 20 个可长期游玩的交互艺术为主：人像、山水、锦鲤、花、极光、茶杯、猫、水母、织物、沙丘、蝴蝶、雨窗、唱片、秋树、月亮、橘子、纸鹤、星系、灯和潮汐。每个有独立造型与配色，没有输赢、分数或倒计时。

拖动或长按揉动粒子，多点触摸可同时影响不同位置。支持形状漂散与重组、变化颜色与呼吸、静止观看、沉浸观看、复原及 PNG 保存。

- `index.html`：作品集
- `art/`：20 个艺术入口
- `assets/art/`：形状算法、互动及绘制代码
- `standalone-art/`：可直接打开的 20 个独立 HTML
- `downloads/touch-art-20.zip`：新版完整包
- `art-manifest.json`、`ART-CREDITS.md`：新题材与署名许可
- `archive/games-v1.html`：第一版 Games 10 个 + Particles 10 个的入口
- `originals/`、`games/`、`standalone/`：第一版的原版、改编和独立文件

无需安装库。用 `python3 -m http.server 8000` 启动静态服务，或直接打开 `standalone-art/` 中的单页文件。`python3 build_art.py`、`python3 build_gallery.py`、`python3 package_art.py` 分别生成艺术入口、展览页和下载包。

20 个新的具象造型由本项目重新创作，粒子回位及惯性模型改编自 maks 的 Mouse Twitch（OpenProcessing）。按 CC BY-NC-SA 3.0 提供，具体见 ART-CREDITS.md。第一版 20 个来源及许可仍见 CREDITS.md。
