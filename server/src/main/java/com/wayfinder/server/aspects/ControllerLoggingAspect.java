package com.wayfinder.server.aspects;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;

@Aspect
public class ControllerLoggingAspect {
	private static final Logger logger = LogManager.getLogger();

	@Pointcut("execution(* com.wayfinder.server.controllers.*.* (..))")
	void controllers() {
	}
	
	@Before("controllers()")
	void logControllerHandlerStart(JoinPoint jp) {
		logger.trace("Entering handler method " + jp.getSignature());
	}

	@After("controllers()")
	void logControllerHandlerEnd(JoinPoint jp) {
		logger.trace("Exiting handler method " + jp.getSignature());
	}
}
