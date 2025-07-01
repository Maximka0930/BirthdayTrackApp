using BirthdayTrack.API.Contracts;
using BirthdayTrack.Core.Abstractions;
using BirthdayTrack.Core.Models;
using Microsoft.AspNetCore.Mvc;

namespace BirthdayTrack.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UsersAllInfoController : ControllerBase
    {
        private readonly IUsersAllInfoService _usersAllInfoService;

        public UsersAllInfoController(IUsersAllInfoService usersAllInfoService)
        {
            _usersAllInfoService = usersAllInfoService;
        }

        [HttpGet]
        public async Task<ActionResult<List<UsersAllInfoResponse>>> GetUsers()
        {
            var users = await _usersAllInfoService.GetAllUsers();
            var response = users.Select(u => new UsersAllInfoResponse(u.Id, u.Name, u.SurName, u.Patronymic, u.DateOfBirth, u.UserStatus, u.Wishes, u.Hobbies, u.DataImage));
            return Ok(response);
        }
        [HttpPost]
        public async Task<ActionResult<Guid>> CreateUser([FromBody] UsersAllInfoRequest request)
        {
            var user = UserAllInfo.Create(
                Guid.NewGuid(),
                request.Name,
                request.SurName,
                request.Patronymic,
                request.DateOfBirth,
                request.UserStatus,
                request.Wishes,
                request.Hobbies,
                request.DataImage);
            var userId = await _usersAllInfoService.CreateUser(user);
            return Ok(userId);
        }

        [HttpPut("{id:guid}")]
        public async Task<ActionResult<Guid>> UpdateUsers(Guid id, [FromBody] UsersAllInfoRequest request)
        {
            var userId = await _usersAllInfoService.UpdateUser(id, request.Name, request.SurName, request.Patronymic, request.DateOfBirth, request.UserStatus, request.Wishes, request.Hobbies, request.DataImage);
            return Ok(userId);
        }

        [HttpDelete("{id:guid}")]
        public async Task<ActionResult<Guid>> DeleteUser(Guid id)
        {
            return Ok(await _usersAllInfoService.DeleteUser(id));
        }
    }
}
