def test(s, len):
    i = 0
    j = len - 1
    while (i < j):
        if (s[i] != s[j]):
            return 0
        i += 1
        j -= 1

    return 1

s = ''
print("Please enter a string")
s = input()
if (test(s, len(s))):
    print("True")
else:
    print("False")    
