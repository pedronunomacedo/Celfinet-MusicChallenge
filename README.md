# Celfinet-MusicChallenge

## Main goal

The purpose of this challenge is to create an online gallery platform where each user can uopload photographs with a personalized soundtrack, one that matches the theme of the photos.

## Technologies and Frameworks

<div class="w-2" style="display: flex; flex-direction: row; justify-content: space-around">
    <div style="display: flex; flex-direction: column; align-items: center;">
        <img src="https://github.com/user-attachments/assets/99560f1f-0389-4011-bde1-6a5e6095f471" width="100" height="100"  />
        <span>React</span>
        <span>(frontend)</span>
    </div>
    <div style="display: flex; flex-direction: column; align-items: center;">
        <img src="https://github.com/user-attachments/assets/5256c54d-33eb-4689-936f-906b857609a1" width="100" height="100" />
        <span>Python</span>
        <span>(API)</span>
    </div>
    <div style="display: flex; flex-direction: column; align-items: center;">
        <img src="https://github.com/user-attachments/assets/81960953-8a5f-4fab-ad27-1e799ef8dea0" width="100" height="100" />
        <span>MongoDB</span>
        <span>(Database)</span>
    </div>
</div>

## How to run this project?

1. Clone the repository to your local machine.

```sh
git clone https://github.com/pedronunomacedo/Celfinet-MusicChallenge.git
```

2. Enter the project repository folder.

```sh
cd Celfinet-MusicChallenge
```

3. Now, let's build the docker containers for both backend and frontend. Start by going the backend folder. 

```sh
cd backend
```

4. Build and run the backend docker container.

```sh
docker-compose up -d
```

5. Now, let's build and run the frontend docker container.

```sh
cd ../frontend
```

6. Build and run the frontend docker container.

```sh
docker-compose up -d
```

7. Finally, you can access this project on the link http://localhost:3000.
