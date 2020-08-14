import json
import pandas as pd
import os
import shutil
from datetime import datetime

DATA_DIR = "../../data"
DATA_FILE = os.path.join(DATA_DIR, "data.json")
CRAWLING_FILE = os.path.join(DATA_DIR, "save.json")
DUMP_FILE = os.path.join(DATA_DIR, "crawling2.pkl")

store_columns = (
    "id",  # 음식점 id
    "store_name",  # 음식점 이름
    "branch",  # 지점명
    "area",  # 지역명
    "tel",  # 전화번호
    "address",  # 주소
    "latitude",  # 위도
    "longitude",  # 경도
    "category_list",  # 카테고리
    "store_img",  # 이미지
)
menu_columns = (
    "store_id",  # 음식점 id
    "menu",  # 메뉴이름
    "price",  # 가격
)
tag_columns = (
    "store_id",  # 음식점 id
    "tag",  # 태그 이름
)
amenity_columns = (
    "store_id",  # 음식점 id
    "amenity"  # 편의시설 이름
)
bhour_columns = (
    "store_id",  # 음식점 id
    "type",  # 영업시간 종류
    "week_type",  # 주 단위 종류
    "mon",  # 월요일 포함유무
    "tue",
    "wed",
    "thu",
    "fri",
    "sat",
    "sun",
    "start_time",  # 시작시간
    "end_time",  # 종료시간
    "etc",  # 기타정보
)
review_columns = (
    "id",  # 리뷰 id
    "user_id",  # 유저 id
    "store_id",  # 음식점 id
    "writer_name",  # 작성자명
    "date",  # 작성일
    "content",  # 내용
    "score",  # 총점
    "taste",  # 맛별점
    "price",  # 가격별점
    "service",  # 서비스별점
    "tag_list",  # 태그 목록
)
review_img_columns = (
    "review_id",  # 리뷰id
    "img",
)


def import_data(data_path=DATA_FILE, crawling_path=CRAWLING_FILE):
    try:
        with open(data_path, encoding="utf-8") as f:
            data = json.loads(f.read())
    except FileNotFoundError as e:
        print(f"`{data_path}` 가 존재하지 않습니다.")
        exit(1)
    try:
        with open(crawling_path, encoding="utf-8") as f:
            crawling = json.loads(f.read())
    except FileNotFoundError as e:
        print(f"`{crawling_path}` 가 존재하지 않습니다.")
        exit(1)

    store = []
    menu = []
    tag = []
    amenity = []
    bhour = []
    review = []
    review_img = []

    cur = 0
    review_id = 1
    print(crawling[len(crawling)-1]["id"])
    for d in data:
        # print(d["id"])d["id"]
        if cur < len(crawling) and d["tel"] is not None and d["tel"] == crawling[cur]["tel"]:
            print(str(cur) + " / " + str(len(crawling)) +": "+str(crawling[cur]["id"])+" "+str(d["id"]))
            store.append([d["id"], crawling[cur]["store_name"], crawling[cur]["branch"],
                          crawling[cur]["area"], crawling[cur]["tel"], crawling[cur]["address"],
                          crawling[cur]["latitude"], crawling[cur]["longitude"], crawling[cur]["category_list"],
                          crawling[cur]["store_img"]])
            for r in crawling[cur]["review_list"]:
                try:
                    taste = r["taste"]
                except:
                    taste = None
                try:
                    price = r["price"]
                except:
                    price = None
                try:
                    service = r["service"]
                except:
                    service = None
                review.append([review_id,  None,  d["id"], r["write_name"], r["date"], r["content"],
                               None, taste, price, service, r["tag_list"]])
                for img in r["img_list"]:
                    review_img.append([review_id, img])
                review_id = review_id+1
            for t in crawling[cur]["tag_list"]:
                tag.append([crawling[cur]["id"], t])
            for a in crawling[cur]["amenity_list"]:
                amenity.append([crawling[cur]["id"], a])
            cur +=1
        else:
            categories = [c["category"] for c in d["category_list"]]
            store.append([d["id"], d["name"], d["branch"], d["area"], d["tel"],
                          d["address"], d["latitude"], d["longitude"], "|".join(categories), None])

            for re in d["review_list"]:
                r = re["review_info"]
                u = re["writer_info"]
                review.append([review_id, None, d["id"], u["id"], r["reg_time"],
                               r["content"], r["score"], None, None, None, None])
                review_id = review_id+1

        # menu
        for m in d["menu_list"]:
            menu.append([d["id"], m["menu"], m["price"]])
        # bhour
        for bh in d["bhour_list"]:
            bhour.append([d["id"], bh["type"], bh["week_type"], bh["mon"], bh["tue"], bh["wed"],
                          bh["thu"], bh["fri"], bh["sat"], bh["sun"], bh["start_time"], bh["end_time"], bh["etc"]])

            # print(str(cur)+": "+str(crawling[cur]["id"]))
    # print(store)
    menu_frame = pd.DataFrame(data=menu, columns=menu_columns)
    tag_frame = pd.DataFrame(data=tag, columns=tag_columns)
    amenity_frame = pd.DataFrame(data=amenity, columns=amenity_columns)
    bhour_frame = pd.DataFrame(data=bhour, columns=bhour_columns)
    review_img_frame = pd.DataFrame(
        data=review_img, columns=review_img_columns)
    store_frame = pd.DataFrame(data=store, columns=store_columns)
    review_frame = pd.DataFrame(data=review, columns=review_columns)

    return {
        "store": store_frame,
        "menu": menu_frame,
        "tag": tag_frame,
        "amenity": amenity_frame,
        "bhour": bhour_frame,
        "review": review_frame,
        "review_img": review_img_frame,
    }


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
    print(data["store"].head())
    print(f"\n{separater}\n\n")


if __name__ == "__main__":
    main()
