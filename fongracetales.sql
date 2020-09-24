-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema fongracetales
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema fongracetales
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `fongracetales` DEFAULT CHARACTER SET utf8 ;
USE `fongracetales` ;

-- -----------------------------------------------------
-- Table `fongracetales`.`asociados`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fongracetales`.`asociados` (
  `cedula` INT(10) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `nombres` VARCHAR(50) NOT NULL,
  `apellidos` VARCHAR(50) NOT NULL,
  `email` VARCHAR(45) NULL,
  `estado` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`cedula`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `fongracetales`.`administradores`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fongracetales`.`administradores` (
  `usuario` VARCHAR(10) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`usuario`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `fongracetales`.`descuentos_aplicados`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fongracetales`.`descuentos_aplicados` (
  `id` VARCHAR(8) NOT NULL,
  `cedula` INT(10) NOT NULL,
  `concepto` VARCHAR(60) NOT NULL,
  `numero` INT NOT NULL,
  `valor_capital` DECIMAL(10) NOT NULL,
  `valor_interes` DECIMAL(10) NOT NULL,
  `valor_seguro` DECIMAL(10) NULL,
  `valor_total` DECIMAL(10) NOT NULL,
  PRIMARY KEY (`id`, `cedula`, `concepto`),
  INDEX `fk_descuentos_aplicados_asociados_idx` (`cedula` ASC) VISIBLE,
  CONSTRAINT `fk_descuentos_aplicados_asociados`
    FOREIGN KEY (`cedula`)
    REFERENCES `fongracetales`.`asociados` (`cedula`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `fongracetales`.`descuentos_enviados`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fongracetales`.`descuentos_enviados` (
  `id` VARCHAR(8) NOT NULL,
  `cedula` INT(10) NOT NULL,
  `concepto` VARCHAR(60) NOT NULL,
  `numero` INT NOT NULL,
  `valor_capital` DECIMAL(10) NOT NULL,
  `valor_interes` DECIMAL(10) NOT NULL,
  `valor_seguro` DECIMAL(10) NULL,
  `valor_total` DECIMAL(10) NOT NULL,
  PRIMARY KEY (`id`, `cedula`, `concepto`),
  INDEX `fk_descuentos_enviados_asociados1_idx` (`cedula` ASC) VISIBLE,
  CONSTRAINT `fk_descuentos_enviados_asociados1`
    FOREIGN KEY (`cedula`)
    REFERENCES `fongracetales`.`asociados` (`cedula`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `fongracetales`.`saldos_ahorros`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fongracetales`.`saldos_ahorros` (
  `cedula` INT(10) NOT NULL,
  `fecha_corte` DATE NOT NULL,
  `concepto` VARCHAR(60) NOT NULL,
  `numero` INT NOT NULL,
  `valor_cuota` DECIMAL(10) NOT NULL,
  `saldo` VARCHAR(10) NOT NULL,
  PRIMARY KEY (`cedula`, `fecha_corte`, `concepto`),
  INDEX `fk_saldos_ahorros_asociados1_idx` (`cedula` ASC) VISIBLE,
  CONSTRAINT `fk_saldos_ahorros_asociados1`
    FOREIGN KEY (`cedula`)
    REFERENCES `fongracetales`.`asociados` (`cedula`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `fongracetales`.`saldo_prestamos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fongracetales`.`saldo_prestamos` (
  `cedula` INT(10) NOT NULL,
  `fecha_corte` DATE NOT NULL,
  `concepto` VARCHAR(60) NOT NULL,
  `numero` VARCHAR(45) NULL,
  `valor_cuota` DECIMAL(10) NULL,
  `valor_inicial` DECIMAL(10) NULL,
  `saldo_capital` DECIMAL(10) NULL,
  `saldo_interes` DECIMAL(10) NULL,
  `numero_cuotas` INT NULL,
  PRIMARY KEY (`cedula`, `fecha_corte`, `concepto`),
  INDEX `fk_saldo_prestamos_asociados1_idx` (`cedula` ASC) VISIBLE,
  CONSTRAINT `fk_saldo_prestamos_asociados1`
    FOREIGN KEY (`cedula`)
    REFERENCES `fongracetales`.`asociados` (`cedula`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
