import json
import os

DATA_DIR = "../../data"
DATA_FILE = os.path.join(DATA_DIR, "data.json")

with open(DATA_FILE, encoding="utf-8") as f:
    data = json.loads(f.read())


with open('savedd.json', 'a', encoding="utf-8") as make_file:
    make_file.write(",")
    json.dump(data, make_file,
                ensure_ascii=False, indent="\t")