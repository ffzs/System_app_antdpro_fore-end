// src/access.ts



const isIn = (list1:Array<string>, list2:Array<string>) => {
  return list1.filter(item => {return list2.includes(item)}).length !== 0;
};


export default function access(initialState: { currentUser?: API.CurrentUser | undefined }) {
  const { currentUser } = initialState || {};
  const accessAdmin = ['ROLE_ADMIN', 'ROLE_HR'];
  return {
    canAdmin: currentUser && isIn(accessAdmin, currentUser.access),
  };
}
