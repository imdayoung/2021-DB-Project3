# csv 파일로부터 LOAD
#LOAD DATA INFILE 'C:\\ProgramData\\MySQL\\MySQL Server 8.0\\Uploads\\data.csv'
#INTO TABLE DIAGNOSIS
#FIELDS TERMINATED BY ','
#ENCLOSED BY '"'
#LINES TERMINATED BY '\r\n'
#IGNORE 1 LINES;

# 예비로 확진자 테이블 직접 생성
INSERT INTO `DIAGNOSIS` (`date`,`location`,`age`) VALUES
	('2021-10-20','경기도','42'),
	('2021-10-20','경상도','52'),
	('2021-10-20','서울','28'),
	('2021-10-22','충청도','75'),
	('2021-10-21','전라도','68'),
	('2021-10-21','경상도','45'),
	('2021-10-22','충청도','75'),
    ('2021-12-09','경기도','22'),
    ('2021-12-10','경기도','32'),
    ('2021-12-10','서울','15');