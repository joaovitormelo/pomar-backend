CREATE TABLE person(
	id_person SERIAL PRIMARY KEY,
	"name" VARCHAR(45),
	email VARCHAR(320),
	phone VARCHAR(45)
);

CREATE TABLE "user"(
	id_user SERIAL PRIMARY KEY,
	id_person INT, 
	"password" VARCHAR(45),
	type_user INT,
	CONSTRAINT fk_person
		FOREIGN KEY(id_person)
			REFERENCES person(id_person)
);

CREATE TABLE "session"(
	id_session SERIAL PRIMARY KEY,
	id_user INT, 
	jwt_token VARCHAR(300),
	login_time TIMESTAMPTZ,
	CONSTRAINT fk_user
		FOREIGN KEY(id_user)
			REFERENCES "user"(id_user)
);