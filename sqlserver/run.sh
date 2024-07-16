docker compose up -d
sleep 10
for i in `ls *.sql`
do 
	docker cp $i sqlserver-db-1:/tmp/ 
	docker container exec -it sqlserver-db-1 /opt/mssql-tools/bin/sqlcmd -C -U sa -P Qwerty123! -i /tmp/$i
done
