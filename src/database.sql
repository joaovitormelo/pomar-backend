/*AUTH*/

CREATE TABLE p.person(
	id_person SERIAL PRIMARY KEY,
	"name" VARCHAR(45),
	email VARCHAR(320),
	phone VARCHAR(45)
);

CREATE TABLE p.user(
	id_user SERIAL PRIMARY KEY,
	id_person INT,
	"password" VARCHAR(45),
	type_user INT,
	CONSTRAINT fk_person
		FOREIGN KEY(id_person)
			REFERENCES p.person(id_person)
);

CREATE TABLE p.session(
	id_session SERIAL PRIMARY KEY,
	id_user INT,
	jwt_token VARCHAR(300),
	login_time TIMESTAMPTZ,
	CONSTRAINT fk_user
		FOREIGN KEY(id_user)
			REFERENCES p.user(id_user)
);

/*EMPLOYEE*/

CREATE TABLE p.employee(
	id_employee SERIAL PRIMARY KEY,
	id_person INT,
	CONSTRAINT fk_person
		FOREIGN KEY(id_person)
			REFERENCES p.person(id_person)
);

/*SCHEDULE*/

CREATE TABLE p.event_info(
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

CREATE TABLE p.event(
	id_event SERIAL PRIMARY KEY,
	id_event_info INT,
	"date" DATE,
	CONSTRAINT fk_event_info
		FOREIGN KEY(id_event_info)
			REFERENCES p.event_info(id_event_info)
);

CREATE TABLE IF NOT EXISTS p.assignment
(
    id_assignment SERIAL PRIMARY KEY,
    id_employee INT,
    id_event INT,
    is_completed BOOLEAN,
    CONSTRAINT fk_employee
			FOREIGN KEY (id_employee)
        REFERENCES p.employee(id_employee)
    CONSTRAINT fk_event
			FOREIGN KEY (id_event)
        REFERENCES p.event (id_event)
)

