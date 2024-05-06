from random_word import RandomWords
from essential_generators import DocumentGenerator
import random
import string
import sys


original_stdout = sys.stdout # Save a reference to the original standard output

N= int(input("How many dummy questionnaires do you want to create ? "))
M= int(input("How many dummy questions do you want to add in every single questionnaire ? "))
K = int(input("How many dummy answers do you want to add in every single question ? "))
L = int(input("How many dummy sessions with random given answers do you want to add in every single questionnaire ? "))


with open('dummy_data.sql', 'w') as f:
    sys.stdout = f # Change the standard output to the file we created.
    
    print("INSERT INTO category(title) VALUES('Music');") 
    print("INSERT INTO category(title) VALUES('Society');") 
    print("INSERT INTO category(title) VALUES('Science');")
    print("INSERT INTO category(title) VALUES('Politics');")
    print("INSERT INTO category(title) VALUES('Other');")
    print("insert into registered_users values(2,'dimitris@mail.gr', 'hello1', 'user');")
    print("insert into registered_users values(1,'thanos@mail.gr', 'hello2', 'admin');")
    print("insert into registered_users values(3,'philip@mail.gr', 'hello3', 'admin');") 
    print("insert into registered_users values(4,'yiannis@mail.gr', 'hello4', 'user');")

    for i in range (300,300+N):
        print('INSERT INTO survey VALUES (',i+1,",'",'Questionnaire',i+1,"','", 'KeywordOfSurvey',i+1,"');",sep="")
        for j in range(M):
            print('INSERT INTO questions VALUES (',i*M+j+1,",'",'Question',i*M+j+1,"',", random.randint(0,1),",",random.randint(0,1),",",random.randint(1,5),",",i+1,');',sep="")
        for j in range(M): 
            for k in range(K):
                help = i*M+j+1
                if j==M-2 :
                    rand = random.randint(0,1)
                    if rand==0 :
                        next = help + 1
                    elif rand==1 :
                        next = 0
                elif j==M-1 :
                    next = 0
                else : 
                    next = random.randint(help+1,(i+1)*M)
                print('INSERT INTO answers VALUES (',(i*M+j+1)*K-1+k,",'",'Answer',(i*M+j+1)*K-1+k,"',",help,",",next,");",sep="")
    for u in range(L) :         
        for i in range(300,300+N) : 
            sesID = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
            print("INSERT INTO session (session_id,survey_id,registered_users_id) VALUES ('",sesID,"',",i+1,",",1,");",sep="")
            for j in range(M):
                print('INSERT INTO answers_registered_users VALUES (',random.randint((i*M+j+1)*K-1,(i*M+j+1)*K-1+K-1),",",1,",'",sesID,"');",sep="")

    sys.stdout = original_stdout # Reset the standard output to its original value
    print('Your .sql file with the dummy data has been added into the folder that contains the dummy_data.py file')
