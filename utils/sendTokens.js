export const sendToken = (res, user, msg) => {
    const token = user.getJWTToken();

    res.status(200).json({
      status: true,
      msg,
      user,
      token,
    });
    console.log(`User with userId ${user.Id} Registered Successfully.`);
    };