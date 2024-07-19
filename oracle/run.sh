# docker compose up -d
# sleep 10
for i in `ls *.sql`
do 
	docker cp $i oracle-poc-db-1:/tmp/ 
	docker container exec oracle-poc-db-1 sqlplus system/Qwerty123@localhost:1521/XTEPDB1  @/tmp/$i
done
