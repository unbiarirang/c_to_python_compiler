def test(s, length): 
    i = 0
    j = length
    j -= 1
    while i < j :
        if s[i] != s[j]:
            return 0
        i += 1
        j -= 1
    return 1

def main(): 
    s = ""
    print("Enter the string to test: ", end = '')
    s = input()
    if test(s, len(s)):
        print("true", end = '')
    else:
        print("false", end = '')
    return 0

main()
