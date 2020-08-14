import json
import pandas as pd
import os
import shutil
from datetime import datetime

DATA_DIR = "../data"
STORE_FILE = os.path.join(DATA_DIR, "store.json")
REVIEW_FILE = os.path.join(DATA_DIR, "review.json")
USER_FILE = os.path.join(DATA_DIR, "user.json")
DUMP_FILE = os.path.join(DATA_DIR, "dump.pkl")
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

user_columns = {
    "user_id",
    "survey_result"
}

def import_data():
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
        if(d["category"] != None):
            # print(d["category_list"])
            categories = d["category"].split("|")
            # print(categories)
        else:
            categories = ""
        
        stores.append(
            [
                d["id"],
                d["store_name"],
                d["img"],
                d["area"],
                " ".join(categories)
            ]
        )

    try:
        with open(REVIEW_FILE, encoding="utf-8") as f:
            data = json.loads(f.read())
    except FileNotFoundError as e:
        print(f"`{REVIEW_FILE}` 가 존재하지 않습니다.")
        exit(1)

    reviews = []  # 리뷰 테이블

    for d in data:
        reviews.append(
            [
                d["id"],
                d["store_id"],
                d["user_id"],
                d["total_score"]
            ]
        )
        
    store_frame = pd.DataFrame(data=stores, columns=store_columns)
    review_frame = pd.DataFrame(data=reviews, columns=review_columns)

    try:
        with open(USER_FILE, encoding="utf-8") as f:
            data = json.loads(f.read())
    except FileNotFoundError as e:
        print(f"`{USER_FILE}` 가 존재하지 않습니다.")
        exit(1)
    
    users = []

    for d in data:

        users.append(
            [
                d["id"],
                d["survey_result"]
            ]
        )

    user_frame = pd.DataFrame(data=users, columns=user_columns)

    return {"stores": store_frame, "reviews": review_frame,"users": user_frame}


def dump_dataframes(dataframes):
    pd.to_pickle(dataframes, DUMP_FILE)


def load_dataframes():
    return pd.read_pickle(DUMP_FILE)


def main():
    print("[*] Parsing data...")
    data = import_data()
    print("[+] Done")

    print("[*] Dumping data...")
    dump_dataframes(data)
    print("[+] Done\n")

    data = load_dataframes()

    term_w = shutil.get_terminal_size()[0] - 1
    separater = "-" * term_w

    print("[음식점]")
    print(f"{separater}\n")
    print(data["stores"])
    print(f"\n{separater}\n\n")

    print("[리뷰]")
    print(f"{separater}\n")
    print(data["reviews"])
    print(f"\n{separater}\n\n")

    print("[유저]")
    print(f"{separater}\n")
    print(data["users"])
    print(f"\n{separater}\n\n")

if __name__ == "__main__":
    main()
