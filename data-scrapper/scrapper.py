from bs4 import BeautifulSoup
import requests
page_count = 1
max_page_count= 1021
url="https://www.imdb.com/search/title/?title_type=feature,tv_movie&user_rating=7.0,10.0&adult=include&sort=num_votes,desc&count=250&start=1&ref_=adv_nxt"
while (page_count<max_page_count):
	print(page_count,url)
	html_content = requests.get(url).text
	text_file = open("htmls/"+str(page_count)+".txt", "wb")
	n = text_file.write(html_content.encode("utf8"))
	text_file.close()
	soup = BeautifulSoup(html_content, "lxml")
	url = "https://www.imdb.com"+soup.find_all("a", attrs={"class": "lister-page-next next-page"})[0]["href"]
	page_count = page_count+1
	