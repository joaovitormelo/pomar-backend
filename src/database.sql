/*AUTH*/

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

/*EMPLOYEE*/

CREATE TABLE "employee"(
	id_employee SERIAL PRIMARY KEY,
	id_person INT,
	CONSTRAINT fk_person
		FOREIGN KEY(id_person)
			REFERENCES "person"(id_person)
);

/*SCHEDULE*/

CREATE TABLE event_info(
	id_event_info SERIAL PRIMARY KEY,
	title VARCHAR(60),
	init_time DATE,
	end_time DATE,
	all_day BOOL,
	description TEXT,
	is_task BOOL,
	is_collective BOOL,
	is_routine BOOL,
	init_date DATE,
	frequency CHAR,
	"interval" INT,
	week_days VARCHAR(11),
	end_date DATE,
	times INT
);

CREATE TABLE assignment(
	id_assignment SERIAL PRIMARY KEY,
	id_employee INT,
	id_event_info INT,
	CONSTRAINT fk_employee
		FOREIGN KEY(id_employee)
			REFERENCES "employee"(id_employee),
	CONSTRAINT fk_event_info
		FOREIGN KEY(id_event_info)
			REFERENCES "event_info"(id_event_info)
);

CREATE TABLE event(
	id_event SERIAL PRIMARY KEY,
	id_event_info INT,
	"date" DATE,
	CONSTRAINT fk_event_info
		FOREIGN KEY(id_event_info)
			REFERENCES "event_info"(id_event_info)
);

CREATE TABLE assignment_status(
	id_assignment_status SERIAL PRIMARY KEY,
	id_employee INT,
	id_event INT,
	is_completed BOOL,
	CONSTRAINT fk_employee
		FOREIGN KEY(id_employee)
			REFERENCES "employee"(id_employee),
	CONSTRAINT fk_event
		FOREIGN KEY(id_event)
			REFERENCES "event"(id_event)
);

