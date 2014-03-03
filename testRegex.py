import os, re, sys, random, time
import itertools

#some constants
charArray = list("\^\-*#~!@$%&()_+=`0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWZYZ")
numbers = r'[0123456789]'
undLetter = r'[a-z]'
upLetter = r'[A-Z]'
spLetter = r'[\^\-*#~!@$%&()_+=`]'

class TestRegex:
    def __init__(self,regex):
        self.regex = regex
        self.debug = False
        
    #return a random legal password character
    def randomStr(self,size):
        string = []
        for i in range(0,random.randint(1,size)):
            index = random.randint(1,len(charArray)-1)
            string.append(charArray[index])
        password = "".join(string)
        return password

#helper function automate testing a website rule
def testRegex(name, regex, loops, min, max, listOfLists,size):
    tr = TestRegex(regex)
    failCount = 0
    passed = None
    print("Testing regex for: " + name)
    for i in range(0,loops):
        password = tr.randomStr(size)
        print("\tGenerated Password " + password)
        length = len(password)
        failedClass = None
        
        #check that password is the right size
        if length < min or length > max :
            passed = False
        #password is the right length
        else:
            if listOfLists != None:
                
                #make sure has at least one of the chars in the list
                for specificRegex in listOfLists:
                    if not(re.search(specificRegex, password)):
                        print("\t\tFailed for re" + str(specificRegex))
                        passed = False
                        failedClass = specificRegex
                        break
                    else:
                        passed = True
            else:
                passed = True
        
        #see if password passed website rule rgex
        passedTest = re.match(regex,password)
        if passedTest == None:
            passedTest = False
        else:
            passedTest = True
        
        #check to see if passed spefix regex and website rule
        if passedTest != passed :
            print("\t\tunexpected result: Test Regex: " + str(passedTest) +" CheckedRegex " + str(passed) )
            failCount += 1
    print("\tCompleted test of regex: failed: " + str(failCount) +" of " + str(loops) + "\n\tRequired Character Lists:" + str(listOfLists))

INF = 10000000000 #handles websites that dont care about password length

#check reddit
regex = r'^.{3,}$'
name = "reddit"
numTests = 1000000
minSize = 3
maxSize = INF
list = None
randomCharLen  = 20
testRegex(name,regex,numTests,minSize,maxSize,list,randomCharLen)


#test pilots
regex = r'^(?=.{8,}$)(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[\^\-*#~!@$%&()_+=`]).*'
name = "pilots"
numTests = 2000000
minSize = 8
maxSize = INF
list = [numbers,undLetter,upLetter,spLetter]
randomCharLen  = 30
testRegex(name,regex,numTests,minSize,maxSize,list,randomCharLen)
 
#test ebay
regex = r'^(?=.{6,}$)(?=.*[0-9])(?=.*[A-Z])(?=.*[\^\-*#~!@$%&()_+=`]).*$'
name = "ebay"
numTests = 2000000
minSize = 6
maxSize = INF
list = [numbers,upLetter,spLetter]
randomCharLen  = 30
testRegex(name,regex,numTests,minSize,maxSize,list,randomCharLen)   

#test amazon
regex = r'^.{6,128}$'
name = "amazon"
numTests = 2000000
minSize = 6
maxSize = 128
list = None
randomCharLen  = 200
testRegex(name,regex,numTests,minSize,maxSize,list,randomCharLen)   

#test Microsoft
regex = r'^(?=.{8,16}$)(?=.*[0-9])(?=.*[A-Z])(?=.*[\^\-*#~!@$%&()_+=`]).*$'
name = "microsoft"
numTests = 2000000
minSize = 8
maxSize = 16
list = [numbers,upLetter,spLetter]
randomCharLen  = 30
testRegex(name,regex,numTests,minSize,maxSize,list,randomCharLen)   

#google
regex = r'^.{8,}$'
name = "google"
numTests = 2000000
minSize = 8
maxSize = INF
list = None
randomCharLen  = 30
testRegex(name,regex,numTests,minSize,maxSize,list,randomCharLen) 

#twitter
regex = r'^.{6,}$'
name = "twitter"
numTests = 2000000
minSize = 6
maxSize = INF
list = None
randomCharLen  = 30
testRegex(name,regex,numTests,minSize,maxSize,list,randomCharLen) 

#facebook
regex = r'^.{6,}$'
name = "google"
numTests = 2000000
minSize = 6
maxSize = INF
list = None
randomCharLen  = 30
testRegex(name,regex,numTests,minSize,maxSize,list,randomCharLen) 