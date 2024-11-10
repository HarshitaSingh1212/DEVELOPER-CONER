mkdir file-1
cd file-1
touch a.txt b.txt c.txt
echo "hello 
     /nhii
     /nbye 
     /ngood" > a.txt
echo "it
      /nis
     /n b.txt
     /n ok
     /nso what
     /nnothing
     /ngot it
     /nbye
     " > b.txt
echo "this/nis/nc.txt/nwelcome/nbye" > c.txt
chmod 444 b.txt
chmod g=r c.txt
cat b.txt c.txt >> a.txt
read -p "enter y or n to delete b and c" answer
if [ "$answer" = "y" ]; then
    rm -f b.txt 
    rm -f c.txt
    echo "Deleted."
fi


       

     
