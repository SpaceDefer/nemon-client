# Nemon - Client
![www vaultenc live (1)](https://user-images.githubusercontent.com/63122405/161546961-04c788c9-50ed-4058-ae9e-0d9ea8be8085.png)

* Refer to [TODO.md](https://github.com/SpaceDefer/nemon-client/blob/main/TODO.md) for tasks list.

* Refer to UI design [here](https://www.figma.com/proto/GYTEPNoBelBPkCCZvGyrnQ/Dashboard?node-id=214%3A481&scaling=contain&page-id=0%3A1&starting-point-node-id=1%3A6).

## Code
- Follow the .prettierrc (Prettier autoformats on save, use it)
- Don't use
    ```javascript
    function Component(){
        // ...
    }
    ```
- instead use
    ```javascript
    const Component = () => {
        // ...
    }

    ```

## Setup
To run this project on your local machine,

1. Install all the required dependencies using
```
yarn install
```

2. and start the react app using

```
yarn dev
```