from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public' / 'og' / 'projects'
OUT.mkdir(parents=True, exist_ok=True)
projects = [
    ('insightpilot', 'InsightPilot', 'LOCAL DOCUMENT INTELLIGENCE', 'Hybrid retrieval · sourced answers', '#9ec6bd', '01'),
    ('sdxl-studio', 'SDXL Studio', 'LOCAL IMAGE WORKFLOWS', 'Generate · edit · refine', '#d8bba1', '02'),
    ('interview-room', 'The Interview Room', 'REALTIME VOICE SYSTEMS', 'Listen · respond · interrupt', '#d6cc9e', '03'),
    ('datheon-workbench', 'Datheon AI Workbench', 'DOCUMENTS TO STRUCTURE', 'Extract · validate · inspect', '#a8c9dc', '04'),
]
font_root = Path('C:/Windows/Fonts')
def font(name, size):
    candidate = font_root / name
    return ImageFont.truetype(str(candidate), size) if candidate.exists() else ImageFont.load_default()

for slug, title, eyebrow, subtitle, accent, number in projects:
    image = Image.new('RGB', (1200, 630), '#0b101a')
    px = image.load()
    for y in range(image.height):
        for x in range(image.width):
            halo = max(0, 1 - (((x - 935) / 620) ** 2 + ((y - 125) / 470) ** 2) ** .5)
            shade = int(10 + 22 * halo)
            px[x, y] = (shade + 3, shade + 6, shade + 14)
    glow = Image.new('RGBA', image.size, (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    color = tuple(int(accent[i:i+2], 16) for i in (1, 3, 5))
    gd.ellipse((760, -240, 1420, 420), fill=(*color, 52))
    glow = glow.filter(ImageFilter.GaussianBlur(100))
    image = Image.alpha_composite(image.convert('RGBA'), glow)
    draw = ImageDraw.Draw(image)
    draw.rounded_rectangle((65, 62, 1135, 568), radius=28, fill=(255, 255, 255, 13), outline=(235, 242, 255, 50), width=2)
    draw.rounded_rectangle((103, 104, 1097, 526), radius=20, fill=(15, 21, 33, 155), outline=(255, 255, 255, 24), width=1)
    draw.rounded_rectangle((106, 107, 113, 523), radius=3, fill=(*color, 230))
    draw.text((153, 158), f'JAWAD KRAYYEM     /     PROJECT {number}', fill=(184, 199, 221), font=font('arial.ttf', 19))
    draw.text((153, 227), eyebrow, fill=(*color, 255), font=font('arialbd.ttf', 18))
    draw.text((151, 279), title, fill=(246, 248, 255), font=font('arialbd.ttf', 62))
    draw.text((155, 382), subtitle, fill=(193, 203, 222), font=font('arial.ttf', 25))
    draw.line((155, 449, 1045, 449), fill=(222, 232, 255, 42), width=1)
    draw.text((155, 473), 'LOCAL AI  ·  THOUGHTFUL SOFTWARE  ·  OPEN SOURCE', fill=(163, 176, 199), font=font('arial.ttf', 17))
    image.convert('RGB').save(OUT / f'{slug}.png', optimize=True)
