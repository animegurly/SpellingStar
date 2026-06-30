import json
from pathlib import Path

root = Path(r"c:\Users\AadhyaPC\Desktop\Spelling Site")
main_file = root / "data" / "words.json"
backup_file = root / "data" / "words-backup.json"

if main_file.exists():
    original = main_file.read_text(encoding="utf-8")
    backup_file.write_text(original, encoding="utf-8")

selected = [
    {"word": "about", "difficulty": "easy", "category": "grade-3-4"},
    {"word": "banana", "difficulty": "easy", "category": "grade-3-4"},
    {"word": "beautiful", "difficulty": "easy", "category": "grade-3-4"},
    {"word": "bridge", "difficulty": "medium", "category": "grade-4-5"},
    {"word": "candle", "difficulty": "easy", "category": "grade-3-4"},
    {"word": "dragon", "difficulty": "medium", "category": "grade-4-5"},
    {"word": "journey", "difficulty": "medium", "category": "grade-4-5"},
    {"word": "library", "difficulty": "medium", "category": "grade-4-5"},
    {"word": "mountain", "difficulty": "medium", "category": "grade-4-5"},
    {"word": "ocean", "difficulty": "easy", "category": "grade-3-4"},
]

main_file.write_text(json.dumps(selected, indent=2), encoding="utf-8")
print(f"Backup saved to {backup_file}")
print(f"Active list updated with {len(selected)} words")
