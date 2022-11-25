/*AUTH*/

CREATE TABLE IF NOT EXISTS p.person(
	id_person SERIAL PRIMARY KEY,
	"name" VARCHAR(45),
	email VARCHAR(320),
	phone VARCHAR(45)
);

CREATE TABLE IF NOT EXISTS p.user(
	id_user SERIAL PRIMARY KEY,
	id_person INT,
	"password" VARCHAR(45),
	type_user INT,
	CONSTRAINT fk_person
		FOREIGN KEY(id_person)
			REFERENCES p.person(id_person)
);

CREATE TABLE IF NOT EXISTS p.session(
	id_session SERIAL PRIMARY KEY,
	id_user INT,
	jwt_token VARCHAR(300),
	login_time TIMESTAMPTZ,
	CONSTRAINT fk_user
		FOREIGN KEY(id_user)
			REFERENCES p.user(id_user)
);

/*EMPLOYEE*/

CREATE TABLE IF NOT EXISTS p.employee(
	id_employee SERIAL PRIMARY KEY,
	id_person INT,
	CONSTRAINT fk_person
		FOREIGN KEY(id_person)
			REFERENCES p.person(id_person)
);

/*SCHEDULE*/

CREATE TABLE IF NOT EXISTS p.event(
	id_event SERIAL PRIMARY KEY,
	"date" DATE,
	title VARCHAR(60),
	init_time TIME,
	end_time TIME,
	all_day BOOL,
	description TEXT,
	is_task BOOL,
	is_collective BOOL,
	is_routine BOOL,
	init_date DATE,
	frequency CHAR,
	"interval" INT,
	week_days VARCHAR(11),
	undefined_end BOOLEAN,
	end_date DATE,
	times INT
);

CREATE TABLE IF NOT EXISTS p.assignment
(
    id_assignment SERIAL PRIMARY KEY,
    id_employee INT,
    id_event INT,
    is_completed BOOLEAN,
    CONSTRAINT fk_employee
			FOREIGN KEY (id_employee)
        REFERENCES p.employee(id_employee),
    CONSTRAINT fk_event
			FOREIGN KEY (id_event)
        REFERENCES p.event (id_event)
);

CREATE TABLE IF NOT EXISTS p.routine_exclusion
(
    id_routine_exclusion SERIAL PRIMARY KEY,
    id_event INT,
    date DATE,
    CONSTRAINT fk_event
			FOREIGN KEY (id_event)
        REFERENCES p.event (id_event)
);

