from bs4 import BeautifulSoup
import requests
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
cred = credentials.Certificate('certificate.json')
firebase_admin.initialize_app(cred, {'databaseURL': 'https://imdb-movie-list.firebaseio.com/'})
ref = db.reference('/')
ref.delete()
file_count = 1
movie_count = 1
movies = {}
while file_count<21:
	text_file = open("htmls/"+str(file_count)+".txt", "r")
	html_content = text_file.read()
	soup = BeautifulSoup(html_content, "lxml")
	html = soup.find_all("div", attrs={"class": "lister-item mode-advanced"})
	for movie in html:
		full_title = movie.find_all("h3", attrs={"class": "lister-item-header"})[0]
		try:
			title = full_title.find_all('a', href=True)[0].contents[0]
		except:
			title=""
			continue
		try:
			year = str(movie.find_all("span", attrs={"class": "lister-item-year text-muted unbold"})[0].contents[0]).replace("(","").replace(")","").replace("TV Movie","").strip()
			year = str(''.join(filter(str.isdigit, year)))
		except:
			year=0
		try:
			runtime = movie.find_all('span', attrs={"class": "runtime"})[0].contents[0]
		except:
			runtime=0
		try:
			image = movie.find_all('img')[0]["loadlate"]
		except:
			image=0
		try:
			genre = movie.find_all('span', attrs={"class": "genre"})[0].contents[0]
			genre = genre.split(",")
			genre_count = 0
			for i in genre:
				genre[genre_count] = i.strip()
				genre_count = genre_count + 1
		except:
			genre=[]
		try:
			rating = movie.find_all('div', attrs={"class": "ratings-bar"})[0].contents[0]
			rating = movie.find_all("strong")[0].contents[0]
		except:
			rating = 0
		try:
			description = movie.find_all('p', attrs={"class": "text-muted"})[1].contents[0].strip().replace("\n","")
		except:
			description = ""
		crew = movie.find_all("p", attrs={"class": ""})[0]
		try:
			director=""
			actors = []
			crews = str(crew)
			if crews.find("Director:")>=0:
				crew = crew.find_all('a', href=True)
				director = crew[0].contents[0]
				if crews.find("Stars:")>=0:
					for c in range(1,len(crew)):
						actors.append(crew[c].contents[0])
			elif crews.find("Stars:")>=0:
				crew = crew.find_all('a', href=True)
				for acts in crew.find_all('a', href=True):
					actors.append(acts.contents[0])
		except:
			director=""
			actors = []
		data ={
			"title":title,
			"desc":description,
			"rating":rating,
			"image":image,
			"genre":genre,
			"runtime":runtime,
			"year":year,
			"director":director,
			"actors":actors
		}
		movies[""+str(movie_count)] = data
		movie_count = movie_count + 1
		print(movie_count)
	file_count = file_count + 1
	text_file.close()
ref.push(movies)
print(movies)
	