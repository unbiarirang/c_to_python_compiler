#include <stdio.h>
#include <string.h>

void get_next(int* next,char* word,int l)
{
    int i = 0;
    int j = -1;
    next[0] = -1;
    while ( i < l )
    {
        if( j == -1 || word[i] == word[j] )
        {
            j++;
            i++;
            if( i == l || word[i] != word[j] )
            	next[i] = j;
            else
                next[i] = next[j];
        }
        else j = next[j];
    }
}

void str_kmp(int* next, char* text, char* word, int l1, int l2, int* result)
{
    int i = -1;
    int j = -1;
    int counter = 0;
    while ( i < l1 )
    {
        if ( j == -1 || text[i] == word[j] )
        {
            i++;
            j++;
            if (j == l2)
            {
                counter++;
                result[counter] = i-j;
                j = next[j];
            }
        }
        else j = next[j];
    }
    result[0] = counter;
}

int main()
{
	char text[2000];
	char word[200];
    int l1;
    int l2;
    int next[201];
  	int result[2001];
	printf("Please enter the keyword:\n");
    gets(word);
    printf("Please enter the text:\n");
    gets(text);
  	l1 = strlen(text);
  	l2 = strlen(word);
  	
  	get_next(next, word, l2);
  	str_kmp(next, text, word, l1, l2, result);
    if (result[0]) {
        int i = 1;
        printf("%d", result[0]);
        printf(": ");
        while (i <= result[0]) {
            printf("%d", result[i]);
            printf(" ");
            i++;
        }
        printf("\n");
    } else {
        printf("Null");
    }
    return 0;
}