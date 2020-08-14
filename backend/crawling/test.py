import itertools
from collections import Counter
from parse import load_dataframes
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import matplotlib.font_manager as fm
import folium
import os
import requests
from bs4 import BeautifulSoup
import json
from _collections import OrderedDict
import shutil
from datetime import datetime


def set_config():
    # 폰트, 그래프 색상 설정
    font_list = fm.findSystemFonts(fontpaths=None, fontext="ttf")
    if any(["notosanscjk" in font.lower() for font in font_list]):
        plt.rcParams["font.family"] = "Noto Sans CJK JP"
    else:
        if not any(["malgun" in font.lower() for font in font_list]):
            raise Exception(
                "Font missing, please install Noto Sans CJK or Malgun Gothic. If you're using ubuntu, try `sudo apt install fonts-noto-cjk`"
            )

        plt.rcParams["font.family"] = "Malgun Gothic"

    sns.set_palette(sns.color_palette("Spectral"))
    plt.rc("xtick", labelsize=6)


def show_store_categories_graph(dataframes, n=100):
    headers = {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Whale/2.7.98.19 Safari/537.36'}
    print(datetime.now())
    # 빈 리스트 생성
    stores_crawling = []

    stores = dataframes["stores"]
    boolean_stores1 = stores['id'] > 447332
    stores = stores[boolean_stores1]
    print(len(stores))
    for i, store in stores.iterrows():
        if store['address']:
            address = store['address'].split(' ')
            if "서울" in address[0]:
                if len(address) > 2:
                    query = address[0] + " " + address[1] + " " + \
                        address[2] + " " + store['store_name']
                else:
                    query = address[0] + " " + address[1] + \
                        " " + store['store_name']
            else:
                continue
        else:
            query = store['store_name']

        response = requests.get(
            "https://www.diningcode.com/isearch.php?query=" + query, headers=headers)
        soup = BeautifulSoup(response.text, 'html.parser')
        print(str(i)+" >> " + query)

        while soup.select('#header > h1'):
            print("reload1: " + soup.select('#header > h1')[0].text)
            response = requests.get(
                "https://www.diningcode.com/isearch.php?query=" + query, headers=headers)
            soup = BeautifulSoup(response.text, 'html.parser')

        if soup.find("div", id="subright-cont"):
            for href in soup.find("div", id="subright-cont").find_all("li"):
                response = requests.get(
                    "https://www.diningcode.com" + href.find("a")["href"], headers=headers)
                soup = BeautifulSoup(response.text, 'html.parser')

                # print("https://www.diningcode.com" + href.find("a")["href"])

                while soup.select('#header > h1'):
                    print("reload2: " + soup.select('#header > h1')[0].text)
                    response = requests.get(
                        "https://www.diningcode.com" + href.find("a")["href"], headers=headers)
                    soup = BeautifulSoup(response.text, 'html.parser')
                try:
                    tel = soup.select(
                        '#div_profile > div.s-list.basic-info > ul > li.tel')[0].text
                    if store["tel"] != tel:
                        continue
                except:
                    continue

                store_temp = OrderedDict()
                store_temp["id"] = i
                store_temp["store_name"] = store["store_name"]
                store_temp["branch"] = store["branch"]
                store_temp["area"] = store["area"]
                store_temp["tel"] = store["tel"]
                store_temp["address"] = store["address"]
                store_temp["latitude"] = store["latitude"]
                store_temp["longitude"] = store["longitude"]

                if store["category_list"]:
                    store_temp["category_list"] = "|".join(
                        [c["category"] for c in store["category_list"]])
                else:
                    store_temp["category_list"] = None

                # img list 넣기
                store_img = None
                if soup.select('#div_profile > div.s-list.pic-grade > ul > li.bimg.btn-gallery-open > img'):
                    store_img = soup.select_one(
                        '#div_profile > div.s-list.pic-grade > ul > li.bimg.btn-gallery-open > img')['src']
                store_temp["store_img"] = store_img

                # 태그 받아오기
                tag_list = []
                for tag in soup.select(".tag"):
                    tag_list = tag.text.replace(" ", "").strip().split(",")
                if tag_list[0] != "":
                    store_temp["tag_list"] = tag_list
                else:
                    store_temp["tag_list"] = []
                # print(store_temp["tag_list"])

                amenity_list = []
                for amenity in soup.select(".char"):
                    amenity_list = amenity.text.replace(
                        " ", "").strip().split(",")
                if amenity_list[0] != "":
                    store_temp["amenity_list"] = amenity_list
                else:
                    store_temp["amenity_list"] = []
                # print(store_temp["amenity_list"])

                # 리뷰 받아오기
                review_list = []
                for review_item in soup.find_all("div", class_="latter-graph"):
                    review = OrderedDict()
                    review["write_name"] = review_item.find(
                        "p", class_="person-grade").find("strong").get_text()
                    review["date"] = review_item.find(
                        "i", class_="date").get_text()
                    # 없을 수도 있으니 if 문으로 처리
                    review["content"] = review_item.find(
                        "p", class_="review_contents").get_text()

                    # 점수 받아오기
                    for score in review_item.find_all("p", class_="point-detail"):
                        index = 1
                        for score_i in score.find_all("i", class_="star"):
                            if index == 1:
                                review["taste"] = score_i.get_text()
                            elif index == 2:
                                review["price"] = score_i.get_text()
                            elif index == 3:
                                review["service"] = score_i.get_text()
                            index = index+1

                    # 이미지 리스트
                    review_img_list = []
                    for src in review_item.find_all("div", class_="btn-gallery-review"):
                        review_img_list.append(
                            src.find("img")["src"])
                    review["img_list"] = review_img_list

                    # tag list
                    review_tag_list = []
                    for tag in review_item.select(".tags"):
                        review_tag_list = tag.text.replace(" ", "").split("\n")
                    tag = "|".join([r for r in review_tag_list]).strip("|")
                    review["tag_list"] = tag

                    review_list.append(review)

                store_temp["review_list"] = review_list

                with open('savedd.json', 'a', encoding="utf-8") as make_file:
                    make_file.write(",")
                    json.dump(store_temp, make_file,
                              ensure_ascii=False, indent="\t")

                stores_crawling.append(store_temp)

                break

    # print(json.dumps(stores_crawling, ensure_ascii=False, indent="\t"))
    print(datetime.now())


def main():
    set_config()
    data = load_dataframes()
    show_store_categories_graph(data)


if __name__ == "__main__":
    main()
