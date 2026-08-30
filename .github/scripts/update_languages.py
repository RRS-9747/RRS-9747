import os
import json
import urllib.request

USERNAME = "RRS-9747"
README_PATH = "README.md"

LANG_META = {
    "Java": {
        "badge": "![Java](https://img.shields.io/badge/Java-ED8B00?style=flat-square&logo=openjdk&logoColor=white)",
        "experience": "9+ Years (Expert)",
        "default_desc": "Minecraft Spigot Plugins, Velocity Clusters & JDA Discord Bots"
    },
    "Kotlin": {
        "badge": "![Kotlin](https://img.shields.io/badge/Kotlin-7F52FF?style=flat-square&logo=kotlin&logoColor=white)",
        "experience": "Advanced",
        "default_desc": "Discord Automation Daemons (JDA), Socket Relays & Microservices"
    },
    "JavaScript": {
        "badge": "![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)",
        "experience": "Expert",
        "default_desc": "Interactive Frontend Interfaces, Web APIs & Node.js Daemons"
    },
    "TypeScript": {
        "badge": "![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)",
        "experience": "Proficient",
        "default_desc": "Next.js 14 Full-Stack Web Applications & Typed SDKs"
    },
    "HTML": {
        "badge": "![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)",
        "experience": "9+ Years (Expert)",
        "default_desc": "Modern Responsive Websites, Developer Portals & Web Apps"
    },
    "Python": {
        "badge": "![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)",
        "experience": "Advanced",
        "default_desc": "Server Automation Tools, RCON Sockets & System Utilities"
    },
    "Shell": {
        "badge": "![Bash](https://img.shields.io/badge/Bash-4EAA25?style=flat-square&logo=gnubash&logoColor=white)",
        "experience": "Expert",
        "default_desc": "Linux VPS Hardening (Ubuntu/Debian) & Automated Cron Backups"
    },
    "Batchfile": {
        "badge": "![Batch](https://img.shields.io/badge/Batch-0078D6?style=flat-square&logo=windows&logoColor=white)",
        "experience": "Expert",
        "default_desc": "Windows System Automation & Quick Deployments"
    }
}

def fetch_repos():
    token = os.environ.get("GITHUB_TOKEN")
    headers = {"User-Agent": "GitHub-Action-Script"}
    if token:
        headers["Authorization"] = f"token {token}"
        
    url = f"https://api.github.com/users/{USERNAME}/repos?per_page=100&sort=updated"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        print("API Fetch error:", e)
        return []

def generate_table(repos):
    lang_repos = {}
    for r in repos:
        if r.get("fork"):
            continue
        lang = r.get("language")
        if not lang:
            continue
        lang_repos.setdefault(lang, []).append(r)

    rows = []
    rows.append("| Language | Active Repositories & Applications | Experience Level |")
    rows.append("| :--- | :--- | :--- |")

    for lang, meta in LANG_META.items():
        badge = meta["badge"]
        exp = meta["experience"]
        default_desc = meta.get("default_desc", "")
        
        found = lang_repos.get(lang, [])
        if found:
            repo_links = [f"[`{r['name']}`]({r['html_url']})" for r in found]
            content = f"{', '.join(repo_links)} &bull; _{default_desc}_"
        else:
            content = f"_{default_desc}_"
            
        display_name = "HTML5 & CSS3" if lang == "HTML" else ("Bash / Shell" if lang == "Shell" else lang)
        rows.append(f"| {badge} **{display_name}** | {content} | **{exp}** |")

    return "\n".join(rows)

def update_readme(table_md):
    with open(README_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    start_tag = "<!-- START_LANG_SECTION -->"
    end_tag = "<!-- END_LANG_SECTION -->"

    if start_tag in content and end_tag in content:
        before = content.split(start_tag)[0]
        after = content.split(end_tag)[1]
        new_content = f"{before}{start_tag}\n\n{table_md}\n\n{end_tag}{after}"
    else:
        print("Markers not found in README.md, skipping.")
        return

    with open(README_PATH, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("README.md updated successfully with live dynamic language table!")

if __name__ == "__main__":
    repos = fetch_repos()
    table_md = generate_table(repos)
    update_readme(table_md)
