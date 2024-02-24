use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
};

entrypoint!(process_instruction);

// Define custom errors
#[derive(Debug, Clone, PartialEq)]
pub enum ScriptError {
    InvalidInstruction,
    Unauthorized,
    ExecutionFailed,
    InvalidData,
}
impl From<ScriptError> for ProgramError {
    fn from(e: ScriptError) -> Self {
        ProgramError::Custom(e as u32)
    }
}

// Instruction processing function
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let instructions = match instruction_data.first() {
        Some(&0) => write_script(accounts, &instruction_data[1..]),
        Some(&1) => interpret_script(accounts),
        _ => Err(ProgramError::from(ScriptError::InvalidInstruction)),
    };

    instructions
}

// Function to write script data to an account
fn write_script(accounts: &[AccountInfo], data: &[u8]) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let script_account = next_account_info(accounts_iter)?;

    script_account.try_borrow_mut_data()?[..data.len()].copy_from_slice(data);
    Ok(())
}

fn interpret_script(accounts: &[AccountInfo]) -> ProgramResult {
    msg!("interpreting the script");

    let accounts_iter = &mut accounts.iter();
    let script_account = next_account_info(accounts_iter)?;

    let script_data = script_account.data.borrow();
    let script_str = core::str::from_utf8(&script_data)
        .map_err(|_| ProgramError::from(ScriptError::InvalidData))?;

    let mut stack: Vec<i32> = Vec::new();

    for line in script_str.lines() {
        let parts: Vec<&str> = line.trim().split_whitespace().collect();
        match parts.as_slice() {
            ["PUSH", num] => {
                let num = num
                    .parse::<i32>()
                    .map_err(|_| ProgramError::from(ScriptError::ExecutionFailed))?;
                stack.push(num);
            }
            ["ADD"] => {
                if stack.len() < 2 {
                    msg!("Error: Stack underflow on ADD");
                    return Err(ProgramError::from(ScriptError::ExecutionFailed));
                }
                let a = stack.pop().unwrap();
                let b = stack.pop().unwrap();
                stack.push(b + a);
            }
            ["MUL"] => {
                if stack.len() < 2 {
                    msg!("Error: Stack underflow on MUL");
                    return Err(ProgramError::from(ScriptError::ExecutionFailed));
                }
                let a = stack.pop().unwrap();
                let b = stack.pop().unwrap();
                stack.push(b * a);
            }
            ["PRINT"] => {
                if let Some(value) = stack.last() {
                    msg!("Print: {}", value);
                }
            }
            _ => {
                msg!("Warning: Unrecognized or malformed line");
                // Optionally, continue execution despite the warning
                // return Err(ProgramError::from(ScriptError::InvalidInstruction));
            }
        }
    }

    Ok(())
}
