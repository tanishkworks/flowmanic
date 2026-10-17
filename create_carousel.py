import os
import shutil
from PIL import Image, ImageDraw, ImageFont

W, H = 1080, 1350
FONT_BOLD = r'C:\linkedin automation\Inter-Bold.ttf'
FONT_REG = r'C:\linkedin automation\Inter-Regular.ttf'

def get_font(size, bold=False):
    return ImageFont.truetype(FONT_BOLD if bold else FONT_REG, size)

def wrap_text(text, font, max_width, draw):
    words = text.split()
    lines = []
    curr = ""
    for w in words:
        test = (curr + " " + w).strip()
        bbox = draw.textbbox((0, 0), test, font=font)
        if bbox[2] - bbox[0] > max_width and curr:
            lines.append(curr)
            curr = w
        else:
            curr = test
    if curr:
        lines.append(curr)
    return lines

def draw_icon_cross(draw, x, y, s=22):
    draw.ellipse([x, y, x + s, y + s], fill="#EF4444")
    draw.line([x + 6, y + 6, x + s - 6, y + s - 6], fill="#FFFFFF", width=2)
    draw.line([x + s - 6, y + 6, x + 6, y + s - 6], fill="#FFFFFF", width=2)

def draw_icon_check(draw, x, y, s=22):
    draw.ellipse([x, y, x + s, y + s], fill="#10B981")
    draw.line([x + 5, y + 11, x + 9, y + 15], fill="#FFFFFF", width=2)
    draw.line([x + 9, y + 15, x + 17, y + 7], fill="#FFFFFF", width=2)

def draw_icon_bolt(draw, x, y, s=20, fill="#38BDF8"):
    pts = [
        (x + int(s * 0.55), y),
        (x + int(s * 0.15), y + int(s * 0.55)),
        (x + int(s * 0.50), y + int(s * 0.55)),
        (x + int(s * 0.40), y + s),
        (x + int(s * 0.90), y + int(s * 0.40)),
        (x + int(s * 0.55), y + int(s * 0.40))
    ]
    draw.polygon(pts, fill=fill)

def draw_icon_arrow(draw, x, y, s=16, fill="#38BDF8"):
    cy = y + s // 2
    draw.line([x, cy, x + s, cy], fill=fill, width=2)
    draw.line([x + s - 5, cy - 5, x + s, cy], fill=fill, width=2)
    draw.line([x + s - 5, cy + 5, x + s, cy], fill=fill, width=2)

def make_circle_avatar(image_path, size=52):
    if not os.path.exists(image_path):
        return None
    img = Image.open(image_path).convert("RGBA")
    img = img.resize((size, size), Image.Resampling.LANCZOS)
    mask = Image.new("L", (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.ellipse([0, 0, size, size], fill=255)
    output = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    output.paste(img, (0, 0), mask=mask)
    b_draw = ImageDraw.Draw(output)
    b_draw.ellipse([0, 0, size - 1, size - 1], outline="#38BDF8", width=2)
    return output

def create_base_slide(slide_num, total_slides=6):
    img = Image.new('RGB', (W, H), '#080C16')
    draw = ImageDraw.Draw(img)
    m = 44

    # Outer container
    draw.rounded_rectangle([m, m, W - m, H - m], radius=28, fill='#0D1322', outline='#1E293B', width=2)

    # Top brand bar
    draw_icon_bolt(draw, m + 40, m + 44, s=20, fill="#38BDF8")
    draw.text((m + 68, m + 40), "FLOWMANIC", font=get_font(26, bold=True), fill="#38BDF8")
    draw.text((m + 242, m + 42), "·  Agency Automation", font=get_font(20, bold=False), fill="#64748B")

    # Slide index pill
    pill_text = f"{slide_num:02d} / {total_slides:02d}"
    pill_font = get_font(20, bold=True)
    bbox = draw.textbbox((0, 0), pill_text, font=pill_font)
    pw = bbox[2] - bbox[0] + 28
    ph = bbox[3] - bbox[1] + 16
    px = W - m - 40 - pw
    py = m + 36
    draw.rounded_rectangle([px, py, px + pw, py + ph], radius=10, fill="#1E293B")
    draw.text((px + 14, py + 8), pill_text, font=pill_font, fill="#94A3B8")

    # Footer
    fy = H - m - 60
    draw.line([m + 40, fy - 16, W - m - 40, fy - 16], fill="#1E293B", width=1)
    draw.text((m + 40, fy), "flowmanic.tech  ·  Custom AI & n8n Workflows", font=get_font(20, bold=False), fill="#64748B")
    
    if slide_num < total_slides:
        right_text = "Swipe"
        r_font = get_font(20, bold=True)
        r_bbox = draw.textbbox((0, 0), right_text, font=r_font)
        rw = r_bbox[2] - r_bbox[0]
        rx = W - m - 40 - rw - 26
        draw.text((rx, fy), right_text, font=r_font, fill="#38BDF8")
        draw_icon_arrow(draw, rx + rw + 8, fy + 4, s=16, fill="#38BDF8")
    else:
        right_text = "flowmanic.tech ↗"
        r_font = get_font(20, bold=True)
        r_bbox = draw.textbbox((0, 0), right_text, font=r_font)
        rx = W - m - 40 - (r_bbox[2] - r_bbox[0])
        draw.text((rx, fy), right_text, font=r_font, fill="#10B981")

    return img, draw, m

def draw_badge(draw, text, x, y, accent="#38BDF8", bg="#0B2559", has_bolt=False):
    font = get_font(20, bold=True)
    offset_x = 28 if has_bolt else 0
    bbox = draw.textbbox((0, 0), text, font=font)
    bw = bbox[2] - bbox[0] + 28 + offset_x
    bh = bbox[3] - bbox[1] + 16
    draw.rounded_rectangle([x, y, x + bw, y + bh], radius=8, fill=bg, outline=accent, width=1)
    if has_bolt:
        draw_icon_bolt(draw, x + 14, y + 8, s=16, fill=accent)
    draw.text((x + 14 + offset_x, y + 8), text, font=font, fill=accent)
    return y + bh

# ----------------- SLIDE 1: COVER -----------------
def make_slide_1():
    img, draw, m = create_base_slide(1)
    y = m + 115
    y = draw_badge(draw, "AGENCY AUTOMATION PLAYBOOK", m + 40, y, accent="#38BDF8", bg="#0B2559", has_bolt=True) + 32

    # Big Title
    title = "Why Your Agency Is Wasting 20 Hours Every Month On Client Reports."
    for line in wrap_text(title, get_font(52, bold=True), W - (m*2) - 80, draw):
        draw.text((m + 40, y), line, font=get_font(52, bold=True), fill="#FFFFFF")
        y += 66
    
    y += 14
    sub = "And the exact 3-step automated pipeline we engineer to deliver flawless, client-ready reports on the 1st of every month at midnight."
    for line in wrap_text(sub, get_font(25, bold=False), W - (m*2) - 80, draw):
        draw.text((m + 40, y), line, font=get_font(25, bold=False), fill="#94A3B8")
        y += 36

    y += 36
    # Pain Box
    card_x = m + 40
    card_w = W - (m * 2) - 80
    card_h = 340
    draw.rounded_rectangle([card_x, y, card_x + card_w, y + card_h], radius=20, fill="#131D33", outline="#1E293B", width=2)
    
    draw.text((card_x + 36, y + 30), "THE MANUAL REPORTING NIGHTMARE:", font=get_font(20, bold=True), fill="#EF4444")
    
    items = [
        "Logging into 5+ ad dashboards (Meta, Google, TikTok, GA4)",
        "Copy-pasting spend & conversions into fragile Google Sheets",
        "Screenshotting charts into Canva or Google Slides decks",
        "Late deliveries (clients waiting until Day 5 or 6 for data)",
        "High risk of embarrassing client formula errors"
    ]
    iy = y + 74
    for it in items:
        draw_icon_cross(draw, card_x + 36, iy + 4, s=20)
        draw.text((card_x + 68, iy), it, font=get_font(22, bold=False), fill="#E2E8F0")
        iy += 48

    # Bottom swipe CTA banner
    by = y + card_h + 36
    draw.rounded_rectangle([card_x, by, card_x + card_w, by + 80], radius=16, fill="#0B54F7")
    cta_text = "SWIPE TO SEE THE AUTOMATED BLUEPRINT"
    cf = get_font(24, bold=True)
    cb = draw.textbbox((0, 0), cta_text, font=cf)
    tw = cb[2] - cb[0]
    total_w = tw + 34
    cx = card_x + (card_w - total_w) // 2
    draw.text((cx, by + 26), cta_text, font=cf, fill="#FFFFFF")
    draw_icon_arrow(draw, cx + tw + 14, by + 32, s=20, fill="#FFFFFF")

    return img

# ----------------- SLIDE 2: THE PROBLEM -----------------
def make_slide_2():
    img, draw, m = create_base_slide(2)
    y = m + 115
    y = draw_badge(draw, "THE ROOT CAUSE", m + 40, y, accent="#F59E0B", bg="#451A03") + 30

    title = "The 1st of the month shouldn't feel like a spreadsheet emergency."
    for line in wrap_text(title, get_font(46, bold=True), W - (m*2) - 80, draw):
        draw.text((m + 40, y), line, font=get_font(46, bold=True), fill="#FFFFFF")
        y += 60

    y += 10
    desc = "Most agencies lose hundreds of hours of high-value account manager time to repetitive data extraction routines:"
    for line in wrap_text(desc, get_font(23, bold=False), W - (m*2) - 80, draw):
        draw.text((m + 40, y), line, font=get_font(23, bold=False), fill="#94A3B8")
        y += 34

    y += 24
    cards = [
        ("01. Dashboard Hopping", "Logging into Meta, Google Ads, GA4, Shopify, and Klaviyo one by one for 10-20 clients."),
        ("02. Copy-Paste Fatigue", "Exporting CSVs, typing numbers by hand, and praying spreadsheet formulas don't break."),
        ("03. Screenshot Formatting", "Cropping charts into presentation decks instead of spending time talking to clients."),
        ("04. Client Frustration", "Reports arrive on day 5 or 6, when last month's performance data is already stale.")
    ]
    card_x = m + 40
    card_w = W - (m * 2) - 80
    for num_title, body in cards:
        draw.rounded_rectangle([card_x, y, card_x + card_w, y + 116], radius=16, fill="#131D33", outline="#1E293B", width=2)
        draw.text((card_x + 28, y + 20), num_title, font=get_font(24, bold=True), fill="#38BDF8")
        for line in wrap_text(body, get_font(20, bold=False), card_w - 56, draw):
            draw.text((card_x + 28, y + 58), line, font=get_font(20, bold=False), fill="#CBD5E1")
        y += 134

    y += 10
    # Bottom Callout Box
    draw.rounded_rectangle([card_x, y, card_x + card_w, y + 86], radius=14, fill="#1E293B", outline="#334155", width=1)
    draw_icon_bolt(draw, card_x + 24, y + 33, s=20, fill="#FCD34D")
    quote = "Your team was hired to drive strategy — not copy numbers into tables."
    draw.text((card_x + 54, y + 28), quote, font=get_font(22, bold=True), fill="#FCD34D")

    return img

# ----------------- SLIDE 3: THE ARCHITECTURE -----------------
def make_slide_3():
    img, draw, m = create_base_slide(3)
    y = m + 115
    y = draw_badge(draw, "THE FLOWMANIC ARCHITECTURE", m + 40, y, accent="#10B981", bg="#064E3B", has_bolt=True) + 30

    title = "How client reporting works when AI & n8n do the heavy lifting."
    for line in wrap_text(title, get_font(46, bold=True), W - (m*2) - 80, draw):
        draw.text((m + 40, y), line, font=get_font(46, bold=True), fill="#FFFFFF")
        y += 60

    y += 24
    card_x = m + 40
    card_w = W - (m * 2) - 80

    steps = [
        (
            "STEP 01  ·  MIDNIGHT DATA INGESTION",
            "Automatic API Webhook Pull",
            "At 12:01 AM on the 1st of the month, n8n queries Meta Ads, Google Ads, TikTok, and GA4 APIs simultaneously. Metrics are standardized, cross-checked, and stored without human touch.",
            "#38BDF8"
        ),
        (
            "STEP 02  ·  AI PERFORMANCE SYNTHESIS",
            "Executive Insights Generation",
            "An AI intelligence model analyzes month-over-month ROAS, top spenders, CPA trends, and creative fatigue. It writes natural-language executive bullet points highlighting key wins.",
            "#8B5CF6"
        ),
        (
            "STEP 03  ·  MULTI-CHANNEL DELIVERY",
            "Client-Ready PDF + Team Notification",
            "Generates a polished branded PDF, emails it directly to the client's inbox at 8:00 AM, and pings your account manager's Slack channel with a confirmation summary.",
            "#10B981"
        )
    ]

    for step_num, step_name, step_desc, col in steps:
        draw.rounded_rectangle([card_x, y, card_x + card_w, y + 210], radius=18, fill="#131D33", outline=col, width=2)
        # Step header
        draw.text((card_x + 30, y + 22), step_num, font=get_font(18, bold=True), fill=col)
        draw.text((card_x + 30, y + 52), step_name, font=get_font(26, bold=True), fill="#FFFFFF")
        
        # Step body
        dy = y + 96
        for line in wrap_text(step_desc, get_font(20, bold=False), card_w - 60, draw):
            draw.text((card_x + 30, dy), line, font=get_font(20, bold=False), fill="#CBD5E1")
            dy += 30
        y += 236

    return img

# ----------------- SLIDE 4: BEFORE VS AFTER -----------------
def make_slide_4():
    img, draw, m = create_base_slide(4)
    y = m + 115
    y = draw_badge(draw, "HEAD-TO-HEAD COMPARISON", m + 40, y, accent="#8B5CF6", bg="#3B0764") + 30

    title = "Manual Reporting vs. Flowmanic Autopilot."
    for line in wrap_text(title, get_font(46, bold=True), W - (m*2) - 80, draw):
        draw.text((m + 40, y), line, font=get_font(46, bold=True), fill="#FFFFFF")
        y += 60

    y += 20
    card_x = m + 40
    card_w = W - (m * 2) - 80

    # Old Way Box
    old_h = 360
    draw.rounded_rectangle([card_x, y, card_x + card_w, y + old_h], radius=20, fill="#1C141E", outline="#7F1D1D", width=2)
    draw.text((card_x + 32, y + 28), "WITHOUT AUTOMATION (THE OLD WAY)", font=get_font(22, bold=True), fill="#F87171")
    
    old_items = [
        "15–20 hours wasted per account manager every month",
        "Frequent formula & copy-paste errors across sheets",
        "Reports delivered late on Day 5 or 6",
        "Raw numbers with no executive synthesis or insight",
        "Team dreads the 1st of every month"
    ]
    oy = y + 78
    for it in old_items:
        draw_icon_cross(draw, card_x + 32, oy + 4, s=20)
        draw.text((card_x + 64, oy), it, font=get_font(21, bold=False), fill="#FECACA")
        oy += 52
    
    y += old_h + 30

    # New Way Box
    new_h = 360
    draw.rounded_rectangle([card_x, y, card_x + card_w, y + new_h], radius=20, fill="#0F241D", outline="#059669", width=2)
    draw.text((card_x + 32, y + 28), "WITH FLOWMANIC (THE AUTOPILOT WAY)", font=get_font(22, bold=True), fill="#34D399")
    
    new_items = [
        "0 hours spent by your team — 100% autonomous",
        "Direct API sync ensures 100% mathematical accuracy",
        "Delivered on the 1st at 8:00 AM sharp every month",
        "AI-written executive summaries highlighting client wins",
        "Team focuses 100% on strategy and client retention"
    ]
    ny = y + 78
    for it in new_items:
        draw_icon_check(draw, card_x + 32, ny + 4, s=20)
        draw.text((card_x + 64, ny), it, font=get_font(21, bold=False), fill="#A7F3D0")
        ny += 52

    return img

# ----------------- SLIDE 5: WHAT CLIENTS CARE ABOUT -----------------
def make_slide_5():
    img, draw, m = create_base_slide(5)
    y = m + 115
    y = draw_badge(draw, "CLIENT RETENTION SECRET", m + 40, y, accent="#38BDF8", bg="#0B2559") + 30

    title = "Clients don't read 30-page PDF dumps. They want 3 clear answers:"
    for line in wrap_text(title, get_font(46, bold=True), W - (m*2) - 80, draw):
        draw.text((m + 40, y), line, font=get_font(46, bold=True), fill="#FFFFFF")
        y += 60

    y += 24
    card_x = m + 40
    card_w = W - (m * 2) - 80

    questions = [
        (
            "1. THE BOTTOM LINE",
            "\"How much did we spend, and what did it produce?\"",
            "Total ad spend, blended ROAS, new customer volume, and cost per acquisition. Give the executive bottom line upfront in 5 seconds.",
            "#38BDF8"
        ),
        (
            "2. THE BIGGEST WIN",
            "\"What was our standout creative or campaign?\"",
            "Clients love clarity. Highlighting the single top-performing ad or angle proves your agency's creative mastery and builds trust.",
            "#F59E0B"
        ),
        (
            "3. NEXT MONTH'S ACTION PLAN",
            "\"What are we adjusting to scale next month?\"",
            "Proactive recommendations generated by AI based on real budget pacing. Turns reporting from a chore into a retention driver.",
            "#10B981"
        )
    ]

    for q_num, q_head, q_body, col in questions:
        draw.rounded_rectangle([card_x, y, card_x + card_w, y + 210], radius=18, fill="#131D33", outline="#1E293B", width=2)
        draw.text((card_x + 30, y + 22), q_num, font=get_font(18, bold=True), fill=col)
        draw.text((card_x + 30, y + 54), q_head, font=get_font(24, bold=True), fill="#FFFFFF")
        dy = y + 100
        for line in wrap_text(q_body, get_font(20, bold=False), card_w - 60, draw):
            draw.text((card_x + 30, dy), line, font=get_font(20, bold=False), fill="#CBD5E1")
            dy += 30
        y += 236

    return img

# ----------------- SLIDE 6: CTA -----------------
def make_slide_6():
    img, draw, m = create_base_slide(6)
    y = m + 115
    y = draw_badge(draw, "TAKE ACTION TODAY", m + 40, y, accent="#10B981", bg="#064E3B", has_bolt=True) + 30

    title = "Put Your Agency Reporting On Autopilot In Under 14 Days."
    for line in wrap_text(title, get_font(46, bold=True), W - (m*2) - 80, draw):
        draw.text((m + 40, y), line, font=get_font(46, bold=True), fill="#FFFFFF")
        y += 60

    y += 20
    card_x = m + 40
    card_w = W - (m * 2) - 80

    # Guarantees Box
    g_h = 280
    draw.rounded_rectangle([card_x, y, card_x + card_w, y + g_h], radius=20, fill="#131D33", outline="#0B54F7", width=2)
    draw.text((card_x + 32, y + 26), "THE FLOWMANIC PROMISE:", font=get_font(22, bold=True), fill="#38BDF8")
    
    g_items = [
        "Zero Lock-In: All pipelines run in your accounts. You own the code.",
        "Custom n8n Pipelines: Tailored to your exact ad & CRM stack.",
        "14-Day Delivery: From kickoff to production in under two weeks.",
        "Scalable: Add new clients in minutes with zero extra effort."
    ]
    gy = y + 74
    for it in g_items:
        draw_icon_check(draw, card_x + 32, gy + 3, s=20)
        draw.text((card_x + 64, gy), it, font=get_font(21, bold=False), fill="#E2E8F0")
        gy += 48

    y += g_h + 30

    # CTA Box
    cta_h = 230
    draw.rounded_rectangle([card_x, y, card_x + card_w, y + cta_h], radius=20, fill="#0B54F7")
    
    draw.text((card_x + 36, y + 26), "WANT THIS FOR YOUR AGENCY?", font=get_font(20, bold=True), fill="#93C5FD")
    draw.text((card_x + 36, y + 58), "Book a Free 20-Minute Automation Audit", font=get_font(32, bold=True), fill="#FFFFFF")
    draw.text((card_x + 36, y + 110), "We'll audit your workflows & show you exactly what to automate first.", font=get_font(20, bold=False), fill="#DBEAFE")
    
    draw.rounded_rectangle([card_x + 36, y + 152, card_x + card_w - 36, y + 202], radius=10, fill="#FFFFFF")
    btn_text = "Visit flowmanic.tech  or  Email hello@flowmanic.tech"
    bf = get_font(20, bold=True)
    bb = draw.textbbox((0, 0), btn_text, font=bf)
    bw = bb[2] - bb[0]
    bx = card_x + 36 + (card_w - 72 - bw) // 2
    draw.text((bx, y + 164), btn_text, font=bf, fill="#0B54F7")

    y += cta_h + 26

    # Flowmanic Engineering Signature Card
    sig_h = 104
    draw.rounded_rectangle([card_x, y + 10, card_x + card_w, y + 10 + sig_h], radius=16, fill="#131D33", outline="#1E293B", width=1)
    
    # Icon circle with lightning bolt
    draw.ellipse([card_x + 26, y + 34, card_x + 26 + 56, y + 34 + 56], fill="#0B2559", outline="#38BDF8", width=2)
    draw_icon_bolt(draw, card_x + 40, y + 48, s=28, fill="#38BDF8")
    
    # Text
    draw.text((card_x + 104, y + 36), "Built by Flowmanic Engineering", font=get_font(22, bold=True), fill="#FFFFFF")
    draw.text((card_x + 104, y + 68), "Production-grade B2B workflow automation for scaling agencies", font=get_font(18, bold=False), fill="#94A3B8")

    return img

def main():
    out_dir = r'C:\Users\tanis\projects\flowmanic\linkedin_carousel'
    os.makedirs(out_dir, exist_ok=True)

    print("Generating upgraded slides with vector icons...")
    slides = [
        make_slide_1(),
        make_slide_2(),
        make_slide_3(),
        make_slide_4(),
        make_slide_5(),
        make_slide_6()
    ]

    # Save PNG images
    png_paths = []
    for i, s in enumerate(slides, start=1):
        p = os.path.join(out_dir, f"slide_{i}.png")
        s.save(p, "PNG")
        png_paths.append(p)
        print(f"Saved {p}")

    # Save Multi-page PDF
    pdf_path = r'C:\Users\tanis\projects\flowmanic\Flowmanic_Client_Reporting_Carousel.pdf'
    slides[0].save(pdf_path, "PDF", resolution=100.0, save_all=True, append_images=slides[1:])
    print(f"Generated PDF: {pdf_path}")

    # Copy to Desktop
    desktop_pdf = r'C:\Users\tanis\Desktop\Flowmanic_Client_Reporting_Carousel.pdf'
    shutil.copyfile(pdf_path, desktop_pdf)
    print(f"Copied PDF to Desktop: {desktop_pdf}")

if __name__ == '__main__':
    main()
