from rest_framework.decorators import api_view
from rest_framework.response import Response
from .parse import load_dataframes
from .parse_tmp import load_store_dataframes
import pandas as pd
import shutil

from sklearn.decomposition import TruncatedSVD
from sklearn.feature_extraction.text import CountVectorizer
from scipy.sparse.linalg import svds
from sklearn.metrics.pairwise import cosine_similarity

import numpy as np
import warnings

def filter_by_user(dataframes, surveyRes, userIID):
    # 원본 데이터
    origin_store = dataframes["stores"]
    origin_store = origin_store[~origin_store["category_list"].str.contains("카페")]
    origin_review = dataframes["reviews"]
    origin_user = dataframes["users"]
    
    # 같은 타입 유저들만
    origin_user = origin_user[origin_user["survey_result"].str.contains(surveyRes)==True]
    if(len(origin_user)<100):
        print("같은 타입의 데이터가 너무 적어 전체유저를 대상으로 합니다")
        origin_user = dataframes["users"]

    print(origin_user)
    origin_review = pd.merge(
        origin_review, origin_user, on="user_id"
    )

    # stores = pd.merge(
    #     origin_store, origin_review, left_on="store_id", right_on="store_id"
    # )
    # print(stores.head())

    # 필요 없는 칼럼 없애기
    # stores.drop('review_id', axis = 1, inplace = True)
    # stores.drop('user_id', axis = 1, inplace = True)
    # stores.drop('score', axis = 1, inplace = True)
    # print("가공된 음식점 데이터" )
    # print(stores.head())

    # 평점이 0점 이거나 없는 데이터 없애기
    reviews = origin_review[origin_review['score'] >= 1]
    # 300명 이상에게 평점 매겨진 데이터만 가져오기
    if(len(origin_user)>3000):
        filter_reviews = origin_review['user_id'].value_counts() >= 100
        print("user가 너무 많을 경우 제한 건다")
    else:
        filter_reviews = origin_review['user_id'].value_counts() >= 50
        print("적절한 user 수가 있습니다.")
    
    filter_reviews = filter_reviews[filter_reviews].index.tolist()
    new_reviews = reviews[reviews['user_id'].isin(filter_reviews)]
    print("가공 된 리뷰 데이터")
    print(new_reviews)

    # 스토어와 리뷰를 가지고 새로운 데이터 프레임 생성
    stores_reviews = pd.merge(origin_store, new_reviews, on='store_id')
    # 리뷰 아이디는 필요 없으니 버리기
    stores_reviews.drop('review_id', axis=1, inplace=True)
    stores_reviews.drop('store_img', axis=1, inplace=True)
    stores_reviews.drop('store_area', axis=1, inplace=True)
    stores_reviews.drop('category_list', axis=1, inplace=True)
    stores_reviews.drop('survey_result', axis=1, inplace=True)
    print("스토어 리뷰 하나의 데이터로 생성 stores_reviews")
    print(stores_reviews)
    userID = stores_reviews.iloc[0,2]
    print(userID)
    # 피봇 테이블 생성 (values, index, column) 순서
    user_sotre_score = stores_reviews.pivot_table(
        'score', 'user_id', 'store_id', fill_value="0"
    )
    print("피봇 테이블 user_store_score")
    print(user_sotre_score)
   

   # print(user_sotre_score.shape)
    print("피봇 테이블 user_store_score")
    print(user_sotre_score)

    # matrix는 pivot_table 값을 numpy matrix로 만든 것
    matrix = user_sotre_score.values
    # 타입을 부동 소수점으로 지정
    matrix = matrix.astype(np.float64)
    # user_score_mean은 사용자의 평균 평점
    user_score_mean = np.mean(matrix, axis=1)
    print("사용자의 평균 평점")
    print(user_score_mean)

    # matrix_user_mean : 사용자-음식점에 대해 사용자 평균 평점을 뺀 것.
    matrix_user_mean = matrix - user_score_mean.reshape(-1, 1)
    pd.DataFrame(matrix_user_mean, columns=user_sotre_score.columns).head()
    U, sigma, Vt = svds(matrix_user_mean, k=1)
    sigma = np.diag(sigma)

    svd_user_predicted_score = np.dot(
        np.dot(U, sigma), Vt) + user_score_mean.reshape(-1, 1)
    df_svd_preds = pd.DataFrame(
        svd_user_predicted_score, columns=user_sotre_score.columns)
    print("svd 행렬 완성")
    print(df_svd_preds)

    user_row_number = userID-1
    # 최종적으로 만든 pred_df에서 사용자 index에 따라 상점 데이터 정렬 -> 음식 평점이 높은 순으로 정렬 됌
    print("추천 시작")
    print(df_svd_preds.iloc[1])
    sorted_user_predictions = df_svd_preds.iloc[1].sort_values(ascending=False)

    # 원본 평점 데이터에서 user id에 해당하는 데이터를 뽑아낸다.
    user_data = origin_review[origin_review.user_id == userID]

    # 위에서 뽑은 user_data와 원본 상점 데이터를 합친다.
    user_history = user_data.merge(origin_store, on='store_id').sort_values(['score'], ascending=False)

    # 원본 상점 데이터에서 사용자가 본 상점 데이터를 제외한 데이터를 추출
    recommendations = origin_store[~origin_store['store_id'].isin(user_history['store_id'])]
    # 사용자의 상점 평점이 높은 순으로 정렬된 데이터와 위 recommendations을 합친다.
    recommendations = recommendations.merge(pd.DataFrame(sorted_user_predictions).reset_index(), on='store_id')
    # 컬럼 이름 바꾸고 정렬해서 return
    print(recommendations)
    recommendations = recommendations.rename(columns={1: 'Predictions'}).sort_values('Predictions', ascending=False).iloc[:10, :]
    print(recommendations)
    return recommendations

def filter_by_type(dataframes, surveyRes):
    # 원본 데이터
    origin_store = dataframes["stores"]
    origin_store = origin_store[~origin_store["category_list"].str.contains("카페")]
    origin_review = dataframes["reviews"]
    origin_user = dataframes["users"]
    
    # 같은 타입 유저들만
    origin_user = origin_user[origin_user["survey_result"].str.contains(surveyRes)==True]
    if(len(origin_user)<100):
        print("같은 타입의 데이터가 너무 적어 전체유저를 대상으로 합니다")
        origin_user = dataframes["users"]

    print(origin_user)
    origin_review = pd.merge(
        origin_review, origin_user, on="user_id"
    )

    # stores = pd.merge(
    #     origin_store, origin_review, left_on="store_id", right_on="store_id"
    # )
    # print(stores.head())

    # 필요 없는 칼럼 없애기
    # stores.drop('review_id', axis = 1, inplace = True)
    # stores.drop('user_id', axis = 1, inplace = True)
    # stores.drop('score', axis = 1, inplace = True)
    # print("가공된 음식점 데이터" )
    # print(stores.head())

    # 평점이 0점 이거나 없는 데이터 없애기
    reviews = origin_review[origin_review['score'] >= 1]
    # 300명 이상에게 평점 매겨진 데이터만 가져오기
    if(len(origin_user)>3000):
        filter_reviews = origin_review['user_id'].value_counts() >= 100
        print("user가 너무 많을 경우 제한 건다")
    else:
        filter_reviews = origin_review['user_id'].value_counts() >= 50
        print("적절한 user 수가 있습니다.")
    
    filter_reviews = filter_reviews[filter_reviews].index.tolist()
    new_reviews = reviews[reviews['user_id'].isin(filter_reviews)]
    print("가공 된 리뷰 데이터")
    print(new_reviews)

    # 스토어와 리뷰를 가지고 새로운 데이터 프레임 생성
    stores_reviews = pd.merge(origin_store, new_reviews, on='store_id')
    # 리뷰 아이디는 필요 없으니 버리기
    stores_reviews.drop('review_id', axis=1, inplace=True)
    stores_reviews.drop('store_img', axis=1, inplace=True)
    stores_reviews.drop('store_area', axis=1, inplace=True)
    stores_reviews.drop('category_list', axis=1, inplace=True)
    stores_reviews.drop('survey_result', axis=1, inplace=True)
    print("스토어 리뷰 하나의 데이터로 생성 stores_reviews")
    print(stores_reviews)
    userID = stores_reviews.iloc[1,2]
    print(userID)
    # 피봇 테이블 생성 (values, index, column) 순서
    user_sotre_score = stores_reviews.pivot_table(
        'score', 'user_id', 'store_id', fill_value="0"
    )
    print("피봇 테이블 user_store_score")
    print(user_sotre_score)

    # matrix는 pivot_table 값을 numpy matrix로 만든 것
    matrix = user_sotre_score.values
    # 타입을 부동 소수점으로 지정
    matrix = matrix.astype(np.float64)
    # user_score_mean은 사용자의 평균 평점
    user_score_mean = np.mean(matrix, axis=1)
    print("사용자의 평균 평점")
    print(user_score_mean)

    # matrix_user_mean : 사용자-음식점에 대해 사용자 평균 평점을 뺀 것.
    matrix_user_mean = matrix - user_score_mean.reshape(-1, 1)
    pd.DataFrame(matrix_user_mean, columns=user_sotre_score.columns).head()
    U, sigma, Vt = svds(matrix_user_mean, k=1)
    sigma = np.diag(sigma)

    svd_user_predicted_score = np.dot(
        np.dot(U, sigma), Vt) + user_score_mean.reshape(-1, 1)
    df_svd_preds = pd.DataFrame(
        svd_user_predicted_score, columns=user_sotre_score.columns)
    print("svd 행렬 완성")
    print(df_svd_preds)

    user_row_number = userID-1
    # 최종적으로 만든 pred_df에서 사용자 index에 따라 상점 데이터 정렬 -> 음식 평점이 높은 순으로 정렬 됌
    print("추천 시작")
    print(df_svd_preds.iloc[0])
    sorted_user_predictions = df_svd_preds.iloc[0].sort_values(ascending=False)

    # 원본 평점 데이터에서 user id에 해당하는 데이터를 뽑아낸다.
    user_data = origin_review[origin_review.user_id == userID]

    # 위에서 뽑은 user_data와 원본 상점 데이터를 합친다.
    user_history = user_data.merge(origin_store, on='store_id').sort_values(['score'], ascending=False)

    # 원본 상점 데이터에서 사용자가 본 상점 데이터를 제외한 데이터를 추출
    recommendations = origin_store[~origin_store['store_id'].isin(user_history['store_id'])]
    # 사용자의 상점 평점이 높은 순으로 정렬된 데이터와 위 recommendations을 합친다.
    recommendations = recommendations.merge(pd.DataFrame(sorted_user_predictions).reset_index(), on='store_id')
    # 컬럼 이름 바꾸고 정렬해서 return
    print(recommendations)
    recommendations = recommendations.rename(columns={0: 'Predictions'}).sort_values('Predictions', ascending=False).iloc[:10, :]
    print(recommendations)
    return recommendations

# 코사인 유사도
def similar_store(dataframes, storeID):
    origin_store = dataframes["stores"]
    origin_review = dataframes["reviews"]
    print(origin_store)
    print(origin_review)
    # 리뷰 1개 이상 달린 상점만 가져오기
    st_rv = pd.merge(origin_store, origin_review, on="store_id").groupby(["store_id"]).size()
    st_rv = st_rv.index[st_rv>=5]
    new_store = origin_store[origin_store['store_id'].isin(st_rv)]
    print(new_store)

    # 평점이 0점 이거나 없는 데이터 없애기
    reviews = origin_review[origin_review['score'] >= 1]
    print(reviews)
    # 100개 이상의 리뷰를 남긴 유저의 데이터만 가져오기
    filter_reviews = origin_review['user_id'].value_counts() >= 100
    filter_reviews = filter_reviews[filter_reviews].index.tolist()
    new_reviews = reviews[reviews['user_id'].isin(filter_reviews)]
    print("가공 된 리뷰 데이터")
    print(new_reviews)

    # 스토어와 리뷰를 가지고 새로운 데이터 프레임 생성
    stores_reviews = pd.merge(new_store, new_reviews, on='store_id')
    store_user_socre = stores_reviews.pivot_table(
        'score', 'store_id', 'user_id', fill_value="0"
    )
    print(store_user_socre)
    try:
        store_id = int(storeID)
        item_based_collabor = cosine_similarity(store_user_socre)
        item_based_collabor = pd.DataFrame(data = item_based_collabor, index = store_user_socre.index, columns =store_user_socre.index )
        result = item_based_collabor[store_id].sort_values(ascending=False)[:10]
        print(result)
        df1 = pd.DataFrame(data=result.index, columns=['store_id'])
        df2 = pd.DataFrame(data=result.values, columns=['cosine_similarity'])
        df = pd.merge(df1, df2, left_index=True, right_index=True)
        df4 = pd.merge(df, origin_store, on="store_id")
    
        print(df4)
        return df4
    except:
        return "이 상점은 충분한 데이터가 없습니다."
    

def content_store(dataframes, storeID):
    stores = dataframes["stores"]
    reviews = dataframes["reviews"]
    stores = stores[stores["category_list"]!=""]
    stores = stores[stores["store_img"].notnull()]
    print(stores)
    reviews = reviews[reviews["score"]>=5]
    print(reviews)
    stores_reviews = pd.merge(stores, reviews, on="store_id")
    stores_reviews = stores_reviews.groupby(["store_id"]).mean()
    stores_reviews.drop('review_id', axis=1, inplace=True)
    stores_reviews.drop('user_id', axis=1, inplace=True)
    print(stores_reviews)
    stores_reviews = pd.merge(stores, stores_reviews, on="store_id")
    print(stores_reviews)

    count_vector = CountVectorizer(ngram_range=(1, 3))
    c_vector_category = count_vector.fit_transform(stores_reviews['category_list'])
    print(c_vector_category)
    category_c_sim = cosine_similarity(c_vector_category, c_vector_category).argsort()[:, ::-1]
    print(category_c_sim)
    # 특정 상점과 비슷한 상점을 추천해야 하기 때문에 '특정 상점' 정보를 뽑아낸다.
    target_store_index = stores_reviews[stores_reviews['store_id'] == int(storeID)].index.values
    print(target_store_index)
    #코사인 유사도 중 비슷한 코사인 유사도를 가진 정보를 뽑아낸다.
    sim_index = category_c_sim[target_store_index, :10].reshape(-1)
    #본인을 제외
    sim_index = sim_index[sim_index != target_store_index]

    #data frame으로 만들고 vote_count으로 정렬한 뒤 return
    result = stores_reviews.iloc[sim_index].sort_values('score', ascending=False)[:10]
    print(result)
    return result

# 카테고리 컨텐트 기반 필터링
@api_view(['GET', 'POST'])
def contentStore(request):
    if request.method == 'GET':
        store = request.query_params.get("store", "")
        print(store)
        data = load_dataframes()
        print("데이터 전 처리/ 분석 시작")
        result = content_store(data, store)
        print("데이터 분석 완료")
    return Response(result)

# 코사인 유사도를 사용하여 지금 보고 잇는 상점과 비슷한 상점들 추천(완료)
@api_view(['GET', 'POST'])
def similarStore(request):
    if request.method == 'GET':
        store = request.query_params.get("store", "")
        data = load_dataframes()
        print("데이터 전 처리/ 분석 시작")
        result = similar_store(data, store)
        print("데이터 분석 완료")
    return Response(result)

# SVD 사용 협업 필터링 같은 타입들이 좋아하는 상점들
@api_view(['GET', 'POST'])
def filteringByType(request):
    if request.method == 'GET':
        print("filteringByType get 요청 받음")
        typeRes = request.query_params.get("type", "")
        print(typeRes)
        data = load_dataframes()
        print("데이터 전 처리/ 분석 시작")
        df_svd_preds = filter_by_type(data, typeRes)
        print("데이터 분석 완료")
        print(df_svd_preds)

    return Response(df_svd_preds)

@api_view(['GET', 'POST'])
def filteringByUser(request):
    if request.method == 'GET':
        print("filteringBy User get 요청 받음")
        typeRes = request.query_params.get("type", "")
        user = request.query_params.get("user","")
        print(typeRes)
        typeRes = typeRes[:2]
        print(user)
        data = load_dataframes()
        print("데이터 전 처리/ 분석 시작")
        df_svd_preds = filter_by_user(data,typeRes,user)
        print("데이터 분석 완료")
        print(df_svd_preds)

    return Response(df_svd_preds)

