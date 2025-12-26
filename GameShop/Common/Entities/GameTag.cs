using System;

namespace Common.Entities;

public class GameTag
{
    public int GameId { get; set; }
    public int TagId { get; set; }
    public virtual Game Game { get; set; }
    public virtual Tag Tag { get; set; }
}
