// take the user obj
// {
//   name:"Denis",
//   permissions:["ADMIN", "ITEMUPDATE"]
// }
// and check to see if they have these (eg):
// ['PERMISSIONUPDATE', 'ADMIN]

function hasPermission(user, permissionsNeeded) {
  const matchedPermissions = user.permissions.filter(permissionTheyHave =>
    permissionsNeeded.includes(permissionTheyHave)
  );
  if (!matchedPermissions.length) {
    throw new Error(`You do not have sufficient permissions

      : ${permissionsNeeded}

      You Have:

      ${user.permissions}
      `);
  }
}

exports.hasPermission = hasPermission;
