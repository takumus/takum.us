npm run build
echo DONE BUILD
ssh takumus@takum.us -p 18769 'rm -rf ~/site/takum.us/dist'
echo DONE REMOVE REMOTE
scp -P 18769 -rp ~/MyWorks/takum.us/dist takumus@takum.us:~/site/takum.us/client
echo DONE UPLOAD