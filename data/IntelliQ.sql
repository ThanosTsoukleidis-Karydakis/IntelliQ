SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL';

 

DROP SCHEMA IF EXISTS IntelliQ;
CREATE SCHEMA IntelliQ;
USE IntelliQ;

 

--
-- Table structure for table `questions`
--

 

CREATE TABLE questions(
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    required BOOL NOT NULL,
    qtype BOOL NOT NULL,                -- type of question: regular or profile
    category_id INT UNSIGNED NOT NULL,
    survey_id INT UNSIGNED NOT NULL,

    PRIMARY KEY  (id),
    FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (survey_id) REFERENCES survey(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

 

--
-- Table structure for table `answers`
--

 

CREATE TABLE answers(
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    whose_question_id INT UNSIGNED NOT NULL,
    next_question_id INT UNSIGNED,

    PRIMARY KEY  (id),
    FOREIGN KEY (whose_question_id) REFERENCES questions(id) ON DELETE RESTRICT ON UPDATE CASCADE
    -- FOREIGN KEY (next_question_id) REFERENCES questions(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

--
-- Table structure for table `survey`
--

CREATE TABLE survey(
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    keywords VARCHAR(200),                            -- To be seen whether to use a different table (as we do in multivalued attributes)
    --
    -- registered_users_id INT UNSIGNED NOT NULL,
    --

    PRIMARY KEY  (id)
    --
    -- FOREIGN KEY (registered_users_id) REFERENCES registered_users(id) ON DELETE RESTRICT ON UPDATE CASCADE
    --
);

 

--
-- Table structure for table `registered users`
--

CREATE TABLE registered_users(
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    email VARCHAR(50) NOT NULL,
    pass_word VARCHAR(50) NOT NULL,
    roles VARCHAR(20) NOT NULL,

    check(roles in('user','admin')),
    PRIMARY KEY (id)    
);

--
-- Table structure for table `category`
--

CREATE TABLE category(
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,

    PRIMARY KEY (id)
);

 

--
-- Table structure for table `questions_category`
--

 

CREATE TABLE questions_category(
    questions_id INT UNSIGNED NOT NULL,
    category_id INT UNSIGNED NOT NULL,

    PRIMARY KEY (questions_id, category_id),
    FOREIGN KEY (questions_id) REFERENCES questions(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

 

--
-- Table structure for table `answers_registered_users`
--

 

CREATE TABLE answers_registered_users(
    answers_id INT UNSIGNED NOT NULL,
    registered_users_id INT UNSIGNED NOT NULL,
    session_id CHAR(4) NOT NULL,

    PRIMARY KEY (answers_id, registered_users_id, session_id),
    FOREIGN KEY (answers_id) REFERENCES answers(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (registered_users_id) REFERENCES registered_users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (session_id) REFERENCES session(session_id) ON DELETE RESTRICT ON UPDATE CASCADE
);

 

CREATE TABLE session(
    session_id CHAR(4) NOT NULL,
    survey_id INT UNSIGNED NOT NULL,
    registered_users_id INT UNSIGNED NOT NULL,
    Time_Stamp TIMESTAMP,

    PRIMARY KEY (session_id),
    FOREIGN KEY (survey_id) REFERENCES survey(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (registered_users_id) REFERENCES registered_users(id) ON DELETE RESTRICT ON UPDATE CASCADE
    );

 

--
-- storage in order to save useful values
--

 

CREATE TABLE values_storage(
    value_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    saved_value INT UNSIGNED,
    PRIMARY KEY (value_id)
);


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
