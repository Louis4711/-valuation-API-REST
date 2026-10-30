const rateLimit = require('express-rate-limit');


exports.limiter = (minute, limit) => {
	return rateLimit({
		windowMs: minute * 60 * 1000,
		limit: limit,
		standardHeaders: 'draft-8',
		legacyHeaders: false,
		ipv6Subnet: 56,
		message: { error: "Trop de tentatives, réessayez plus tard." },
	});
}

