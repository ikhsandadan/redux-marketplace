

# REDUX-MARKETPLACE

## Installation and Setup

**1. Clone the repository:**

    git clone https://github.com/ikhsandadan/redux-marketplace.git

**2.  Navigate  to  the  project  directory:**

    cd redux-marketplace

**3.  Install  the  dependencies  at  the  root  directory:**

    nvm install --lts  # if using nvm
	  corepack enable
	  yarn set version stable
	  yarn install
	  yarn format

**4.  Run  the  frontend  at  root  (/packages):**

    yarn frontend:dev

**5.  Run  the  backend  at  root  (/packages):**

    yarn backend:serve


## User Roles and Functionalities

### Admin

-   Assign  admin  role  to  a  user  in  the  database.
    
-   On  the  admin  page,  users  can  add  new  users,  edit  existing  ones,  and  delete  users.

    
![1](https://github.com/user-attachments/assets/518b6bc1-981a-4d09-81b6-ea2410dfc810)

![1-1](https://github.com/user-attachments/assets/00eebcac-294f-41b3-ad62-e336c7951218)

![1-2](https://github.com/user-attachments/assets/4b51eb49-8ee8-4b0c-b6e0-471b27240cf7)



### Seller

-   Assign  seller  role  to  a  user  in  the  database.
    
-   On  the  seller  page,  users  can  add  items  for  sale,  including  title,  image,  price,  quantity,  and  description.


  ![2](https://github.com/user-attachments/assets/b40cdcf9-f0dd-446b-bfb3-f5a5475dc1ee)


    
-   Users  can  also  edit  items  they  have  already  listed.


  ![2-1](https://github.com/user-attachments/assets/74dca706-56d9-4a83-a929-908439f8f87e)




### Shopper

-   Assign  shopper  role  to  a  user  in  the  database.
    
-   On  the  main  page,  shoppers  can  purchase  desired  items  and  input  the  quantity  to  be  bought.


  ![3](https://github.com/user-attachments/assets/313f147a-e261-4de1-9199-4cdb6a924521)

  ![3-1](https://github.com/user-attachments/assets/dad2b361-7767-4613-961e-b13329887a6a)


    
-   Users  can  also  view  items  they  have  already  purchased.


  ![3-2](https://github.com/user-attachments/assets/99578ddb-3446-4228-8165-6dacf795ccde)




For a demo of how to use this application, you can refer to the video linked below.


[![redux-marketplace-demo](https://img.youtube.com/vi/ouduXA1Chps/0.jpg)](https://www.youtube.com/watch?v=ouduXA1Chps)


