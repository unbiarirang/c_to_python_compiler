def get_next(m_next, word, l): 
    i = 0
    j = -1
    m_next[0] = -1
    while i < l :
        if j == -1 or word[i] == word[j]:
            j += 1
            i += 1
            if i == l or word[i] != word[j]:
                m_next[i] = j
            else:
                m_next[i] = m_next[j]
        else:
            j = m_next[j]

def str_kmp(m_next, text, word, l1, l2, result): 
    i = -1
    j = -1
    counter = 0
    while i < l1 :
        if j == -1 or text[i] == word[j]:
            i += 1
            j += 1
            if j == l2:
                counter += 1
                result[counter] = i - j
                j = m_next[j]
        else:
            j = m_next[j]
    result[0] = counter

def main(): 
    text = ""
    word = ""
    
    
    m_next =  [0] * 201
    result =  [0] * 2001
    print("Please enter the keyword:\n", end = '')
    word = input()
    print("Please enter the text:\n", end = '')
    text = input()
    l1 = len(text)
    l2 = len(word)
    get_next(m_next, word, l2)
    str_kmp(m_next, text, word, l1, l2, result)
    if result[0]:
        i = 1
        print("%d"%(result[0]), end = '')
        print(": ", end = '')
        while i <= result[0] :
            print("%d"%(result[i]), end = '')
            print(" ", end = '')
            i += 1
        print("\n", end = '')
    else:
        print("Null", end = '')
    return 0

main()
