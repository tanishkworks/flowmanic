import os
from PIL import Image, ImageDraw, ImageFont

os.makedirs('public', exist_ok=True)

# 1. Generate public/og-image.png (1200 x 630)
W, H = 1200, 630
img = Image.new('RGB', (W, H), color='#07090E')
draw = ImageDraw.Draw(img)

# Background subtle gradient / radial effect
for r in range(400, 0, -5):
    alpha = int(40 * (1 - r / 400))
    # radial glow around center-top
    draw.ellipse([600 - r * 1.5, 100 - r, 600 + r * 1.5, 100 + r], fill=(11, 84, 247, alpha) if alpha > 0 else None)

# Add subtle grid lines or border
draw.rounded_rectangle([20, 20, W - 20, H - 20], radius=16, outline='#1E293B', width=2)

# Load fonts
try:
    font_badge = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 20)
    font_brand = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 54)
    font_title = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 44)
    font_sub = ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', 24)
    font_meta = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 22)
except Exception:
    font_badge = ImageFont.load_default()
    font_brand = ImageFont.load_default()
    font_title = ImageFont.load_default()
    font_sub = ImageFont.load_default()
    font_meta = ImageFont.load_default()

# Draw Squircle Logo icon at (80, 80)
logo_size = 72
draw.rounded_rectangle([80, 80, 80 + logo_size, 80 + logo_size], radius=18, fill='#0B54F7')
# Draw White F mark inside logo
draw.rectangle([96, 96, 104, 136], fill='#FFFFFF')
draw.rectangle([96, 96, 134, 106], fill='#FFFFFF')
draw.rectangle([96, 112, 126, 122], fill='#FFFFFF')
# Pulse node dot
draw.ellipse([128, 128, 138, 138], fill='#38BDF8')

# Draw Brand Name next to logo
draw.text((170, 92), "FLOWMANIC", fill='#FFFFFF', font=font_brand)

# Category pill / badge
badge_text = "B2B AI & n8n WORKFLOW AUTOMATION AGENCY"
badge_bbox = draw.textbbox((0, 0), badge_text, font=font_badge)
badge_w = badge_bbox[2] - badge_bbox[0]
badge_x = W - 80 - badge_w - 30
draw.rounded_rectangle([badge_x, 96, W - 80, 136], radius=20, fill='#1E293B', outline='#334155', width=1)
draw.text((badge_x + 15, 104), badge_text, fill='#38BDF8', font=font_badge)

# Main Title headline
title_line1 = "Put Your Marketing Agency"
title_line2 = "On Autopilot."
draw.text((80, 200), title_line1, fill='#FFFFFF', font=font_title)
draw.text((80, 260), title_line2, fill='#0B54F7', font=font_title)

# Core offerings / features
features = [
    "Automated Client Reporting",
    "Instant Lead Qualification & Outreach",
    "AI Content Repurposing Pipelines",
    "Custom n8n & Brevo Architecture"
]
for i, feat in enumerate(features):
    col = 0 if i < 2 else 1
    row = i % 2
    fx = 80 + col * 480
    fy = 360 + row * 60
    # green check dot
    draw.ellipse([fx, fy + 4, fx + 16, fy + 20], fill='#10B981')
    draw.text((fx + 30, fy), feat, fill='#E2E8F0', font=font_sub)

# Bottom bar
draw.line([(80, 520), (W - 80, 520)], fill='#1E293B', width=2)

draw.text((80, 545), "https://flowmanic.tech", fill='#38BDF8', font=font_meta)
draw.text((W - 80 - 270, 545), "hello@flowmanic.tech", fill='#94A3B8', font=font_meta)

img.save('public/og-image.png', format='PNG', optimize=True)
print("Saved public/og-image.png successfully (1200x630)")

# 2. Generate public/logo.png (512 x 512)
logo_img = Image.new('RGBA', (512, 512), color=(0, 0, 0, 0))
logo_draw = ImageDraw.Draw(logo_img)
# Squircle
logo_draw.rounded_rectangle([32, 32, 480, 480], radius=110, fill='#0B54F7')
# Inner F
logo_draw.rectangle([130, 120, 185, 390], fill='#FFFFFF')
logo_draw.rectangle([130, 120, 370, 185], fill='#FFFFFF')
logo_draw.rectangle([130, 220, 310, 280], fill='#FFFFFF')
# Pulse node
logo_draw.ellipse([320, 320, 390, 390], fill='#38BDF8')

logo_img.save('public/logo.png', format='PNG', optimize=True)
print("Saved public/logo.png successfully (512x512)")
