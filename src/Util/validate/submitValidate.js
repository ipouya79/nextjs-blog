const submitValidate = (userData, kids) => {
  let result = true;

  let user = { ...userData };

  delete user.email;
  delete user.mobile;

  for (let elm in user) {
    if (!userData[elm]) result = false;
  }

  for (let kid of kids) {
    if (kid.childNodes.length > 2) result = false;
  }

  if (!userData.mobile && !userData.email) result = false;
  if (userData.mobile && userData.email) result = false;

  return result;
};

export default submitValidate;
