import json
import pandas as pd
import os
import shutil
from datetime import datetime

DATA_DIR = "../data"
DATA_FILE = os.path.join(DATA_DIR, "data.json")
STORE_FILE = os.path.join(DATA_DIR, "data_save.json")
REVIEW_FILE = os.path.join(DATA_DIR, "review.json")
DUMP_FILE = os.path.join(DATA_DIR, "dump_store.pkl")
now = datetime.now()

store_columns = (
    "store_id",  # 음식점 고유번호
    "store_name",  # 음식점 이름
    "store_img",
    "store_area",
    "category_list"
)

review_columns = (
    "review_id",  # 리뷰 고유번호
    "store_id",  # 음식점 고유번호
    "user_id",  # 유저 고유번호
    "score",  # 평점
)

def import_store_data():
    """
    Req. 1-1-1 음식점 데이터 파일을 읽어서 Pandas DataFrame 형태로 저장합니다
    """
    try:
        with open(STORE_FILE, encoding="utf-8") as f:
            data = json.loads(f.read())
    except FileNotFoundError as e:
        print(f"`{STORE_FILE}` 가 존재하지 않습니다.")
        exit(1)

    stores = []

    for d in data:
        if(d["category_list"] != None):
            print(d["category_list"])
            categories = d["category_list"].split("|")
            print(categories)
            
            stores.append(
                [
                    d["id"],
                    d["store_name"],
                    d["store_img"],
                    d["area"],
                    " ".join(categories)
                ]
            )
   
    store_frame = pd.DataFrame(data=stores, columns=store_columns)

    try:
        with open(DATA_FILE, encoding="utf-8") as f:
            data = json.loads(f.read())
    except FileNotFoundError as e:
        print(f"`{DATA_FILE}` 가 존재하지 않습니다.")
        exit(1)

    reviews = []  # 리뷰 테이블

    for d in data:

        for review in d["review_list"]:
            r = review["review_info"]
            u = review["writer_info"]

            reviews.append(
                [r["id"], d["id"], u["id"], r["score"]]
            )

    review_frame = pd.DataFrame(data=reviews, columns=review_columns)

    return {"stores": store_frame,"reviews": review_frame}


def dump_store_dataframes(dataframes):
    pd.to_pickle(dataframes, DUMP_FILE)


def load_store_dataframes():
    return pd.read_pickle(DUMP_FILE)


def main():
    print("[*] Parsing data...")
    data = import_store_data()
    print("[+] Done")

    print("[*] Dumping data...")
    dump_store_dataframes(data)
    print("[+] Done\n")

    data = load_store_dataframes()

    term_w = shutil.get_terminal_size()[0] - 1
    separater = "-" * term_w

    print("[음식점]")
    print(f"{separater}\n")
    print(data["stores"].head())
    print(f"\n{separater}\n\n")

if __name__ == "__main__":
    main()
